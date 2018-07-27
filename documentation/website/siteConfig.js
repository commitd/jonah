/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  // {
  //   caption: 'User1',
  //   image: '/test-site/img/docusaurus.svg',
  //   infoLink: 'https://www.facebook.com',
  //   pinned: true,
  // },
]

const siteConfig = {
  title: 'Jonah' /* title for your website */,
  tagline: 'Exploiting the outputs of structured extraction',
  url: 'https://commitd.github.io/jonah' /* your website url */,
  baseUrl: '/jonah/' /* base url for your project */,
  projectName: 'Jonah',
  headerLinks: [
    { doc: 'setup.index', label: 'Setup' },
    { doc: 'use.index', label: 'Use' },
    { doc: 'dev.index', label: 'Develop' },
    { href: 'https://github.com/commitd/jonah-server', label: 'Server Source' },
    { href: 'https://github.com/commitd/jonah-ui', label: 'UI Source' }
  ],
  users,
  /* path to images for header/footer */
  // headerIcon: 'img/docusaurus.svg',
  // footerIcon: 'img/docusaurus.svg',
  // favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#000000',
    secondaryColor: '#ddd'
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: 'Copyright © ' + new Date().getFullYear() + ' Committed',
  organizationName: 'commitd', // or set an env variable ORGANIZATION_NAME
  projectName: 'jonah', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
    /* add graphql syntax highlighting. from: https://github.com/isagalaev/highlight.js/pull/1543/files */
    hljs: function(hljs) {
      hljs.registerLanguage('graphql', function(hljs) {
        return {
          aliases: ['gql'],
          keywords: {
            keyword: 'query mutation subscription|10 type interface union scalar fragment|10 enum on ...',
            literal: 'true false null'
          },
          contains: [
            hljs.HASH_COMMENT_MODE,
            hljs.QUOTE_STRING_MODE,
            hljs.NUMBER_MODE,
            {
              className: 'type',
              begin: '[^\\w][A-Z][a-z]',
              end: '\\W',
              excludeEnd: true
            },
            {
              className: 'literal',
              begin: '[^\\w][A-Z][A-Z]',
              end: '\\W',
              excludeEnd: true
            },
            {
              className: 'variable',
              begin: '\\$',
              end: '\\W',
              excludeEnd: true
            },
            {
              className: 'keyword',
              begin: '[.]{2}',
              end: '\\.'
            },
            {
              className: 'meta',
              begin: '@',
              end: '\\W',
              excludeEnd: true
            }
          ],
          illegal: /([;<']|BEGIN)/
        }
      })
    }
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/commitd/jonah'
}

module.exports = siteConfig
