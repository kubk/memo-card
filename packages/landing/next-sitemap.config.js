const siteUrl = 'https://memocard.org';

const alternativeLanguages = ['ru', 'es', 'pt-br', 'uk'];

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  exclude: [
    '/icon.png',
    ...alternativeLanguages.map((lang) => `/${lang}`),
  ],
  additionalPaths: async (config) => [
    {
      loc: '/',
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        { href: siteUrl, hreflang: 'x-default' },
        ...alternativeLanguages.map((lang) => ({
          href: `${siteUrl}/${lang}`,
          hreflang: lang,
        })),
      ],
    },
  ],
}
