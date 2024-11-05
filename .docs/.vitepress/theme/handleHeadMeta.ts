import { type HeadConfig, type TransformContext } from 'vitepress';

export function handleHeadMeta(context: TransformContext) {
  const { description, title, relativePath } = context.pageData;
  const ogUrl: HeadConfig = ['meta', { property: 'og:url', content: `https://alfred.1991421.cn/${relativePath.slice(0, -3)}.html` }];
  const ogTitle: HeadConfig = ['meta', { property: 'og:title', content: title || 'Alfred-Workflows' }];
  const ogDescription: HeadConfig = ['meta', {
    property: 'og:description',
    content: description || context.description,
  }];
  const ogImage: HeadConfig = ['meta', { property: 'og:image', content: 'appicon.png' }];
  const twitterCard: HeadConfig = ['meta', { name: 'twitter:card', content: 'summary' }];
  const twitterDescription: HeadConfig = ['meta', {
    name: 'twitter:description',
    content: description || context.description,
  }];

  const head: HeadConfig[] = [
    ogUrl, ogTitle, ogDescription, ogImage,
    twitterCard, twitterDescription,
  ];

  return head;
}

