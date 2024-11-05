import { defineConfig } from 'vitepress';
import { workflowMetaInfos } from '../init-md.mjs';
import { handleHeadMeta } from './theme/handleHeadMeta';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Alfred-Workflows',
  base: '/',
  description: 'workflows for alfred',
  lang: 'en-US',
  // outDir: '../docs',
  head: [
    ['link', {
      rel: 'shortcut icon',
      href: 'https://content.invisioncic.com/r229491/monthly_2017_07/favicon.ico.25cb7af4f019e1868fe63bd83ed0d40c.ico',
    }],

  ],
  themeConfig: {
    logo: '/appicon.png',
    search: {
      provider: 'local',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Discussion', link: 'https://github.com/alanhe421/alfred-workflows/discussions' },
      { text: 'Medium', link: 'https://medium.com/@alanhe421/list/alfred-a65a11fa7a0f' },
      { text: 'Official Forum', link: 'https://www.alfredforum.com' },
    ],

    sidebar: [
      {
        text: 'Workflows',
        items: workflowMetaInfos.map(item => ({
          text: item.title,
          link: `/workflows/${item.name}/${item.name}`,
        })),
      },
      {
        text: 'About',
        link: '/about',
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/alanhe421/alfred-workflows' },
      { icon: 'x', link: 'https://x.com/alanhe421' },
    ],
    footer: {
      copyright: `Copyright © 2024-present <a href="https://1991421.cn">Alan He</a>`,
    },
  },
  lastUpdated: true,
  async transformHead(context) {
    return handleHeadMeta(context)
  },
});
