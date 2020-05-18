/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash');

// returns data broken up into categories for a sidebar
function readCategories(sidebar, allMetadata, languages) {
  const allCategories = {};

  // Go through each language that might be defined.
  languages
    .filter((lang) => lang.enabled)
    .map((lang) => lang.tag)
    .forEach((language) => {
      // Get all related metadata for the current sidebar and specific to the language.
      const metadatas = Object.values(allMetadata)
        .filter(
          (metadata) =>
            metadata.sidebar === sidebar && metadata.language === language,
        )
        .sort((a, b) => a.order - b.order);

      // Define the correct order of categories.
      const sortedCategories = _.uniq(
        metadatas.map((metadata) => metadata.category),
      );

      const processSubcategories = (categoryItems) => {
        const mapSubcategories = (subcategory) => {
          const seenSubcategories = new Set();
          const subcategories = categoryItems
            .filter(
              // Filter will find every items that belongs to that subcategory or any other sub-subcategory.
              (item) =>
                subcategory !== null
                  ? item.subcategory === subcategory ||
                    item.parentSubcategory === subcategory
                  : !item.subcategory || !item.parentSubcategory, // Support non-existing field for back compatibility.
            )
            .map((item) => {
              const {subcategory: itemSubcategory} = item;

              if (!itemSubcategory || itemSubcategory === subcategory) {
                return {
                  type: 'LINK',
                  item,
                };
              }
              // Subcategory has been processed, we can skip it.
              if (seenSubcategories.has(itemSubcategory)) {
                return false; // We are in a map, so will filter the skipped items latter.
              }
              seenSubcategories.add(itemSubcategory);

              return {
                type: 'SUBCATEGORY',
                title: itemSubcategory,
                children: mapSubcategories(itemSubcategory),
              };
            })
            .filter(Boolean); // Removing skipped items.

          return subcategories;
        };

        return mapSubcategories(null); // Items that belongs to the first (or root) category is when the subcategory or parentSubcategory is null or inexistent.
      };

      const metadatasGroupedByCategory = _.chain(metadatas)
        .groupBy((metadata) => metadata.category)
        .mapValues(processSubcategories)
        .value();

      const categories = sortedCategories.map((category) => ({
        type: 'CATEGORY',
        title: category,
        children: metadatasGroupedByCategory[category],
      }));
      allCategories[language] = categories;
    });

  return allCategories;
}

module.exports = readCategories;
