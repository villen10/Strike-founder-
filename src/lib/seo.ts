export interface ArticleSchemaData {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  seoKeywords: string[];
}

export function generateSchemaForArticle(article: ArticleSchemaData): string {
  const baseUrl = 'https://striku.cloud';
  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.summary,
    genre: article.category,
    keywords: article.seoKeywords.join(', '),
    datePublished: article.lastUpdated,
    dateModified: article.lastUpdated,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/#article-${article.id}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Striku Technologies',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: 'https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI',
      },
    },
    author: {
      '@type': 'Organization',
      name: 'Striku Compliance Engineering',
    },
    about: {
      '@type': 'Thing',
      name: 'YouTube Content Moderation & Pre-Upload Strike Prevention',
    },
  };

  return JSON.stringify(schemaObj, null, 2);
}
