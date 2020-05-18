/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const {readSidebar} = require('../readMetadata');
const sidebarSubcategories = require('./__fixtures__/sidebar-subcategories');
const sidebarMultilevelSubcategories = require('./__fixtures__/sidebar-multilevel-subcategories');

jest.mock('../env', () => ({
  translation: {
    enabled: true,
    enabledLanguages: () => [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
      {
        enabled: true,
        name: '한국어',
        tag: 'ko',
      },
    ],
  },
  versioning: {
    enabled: true,
    defaultVersion: '1.0.0',
  },
}));

jest.mock(`${process.cwd()}/siteConfig.js`, () => ({}), {virtual: true});
jest.mock(`${process.cwd()}/sidebars.json`, () => true, {virtual: true});

describe('readMetadata', () => {
  describe('readSidebar', () => {
    test('should verify sub category data and verify order', () => {
      const items = readSidebar(sidebarSubcategories);
      expect(items).toMatchSnapshot();
    });
    test('should verify multilevel sub category data and verify order', () => {
      const items = readSidebar(sidebarMultilevelSubcategories);
      expect(items).toMatchSnapshot();
    });
  });
});
