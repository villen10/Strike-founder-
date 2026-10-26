import type { FAQItem } from '../components/LegalTrustHub';

export interface ArticleSchemaData {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  seoKeywords: string[];
}

export interface JsonLdAnswer {
  '@type': 'Answer';
  text: string;
}

export interface JsonLdQuestionEntity {
  '@type': 'Question';
  name: string;
  acceptedAnswer: JsonLdAnswer;
}

export interface JsonLdFaqPage {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: JsonLdQuestionEntity[];
}

export type FAQQuestionSource = Pick<FAQItem, 'question' | 'answer'> | { question: string; answer: string };

/**
 * Transforms an array of FAQ items (e.g. from LegalTrustHub) into a structured array
 * of Schema.org JSON-LD 'Question' entities tailored for AI conversational search engines
 * (ChatGPT Search, Google AI Overviews, Perplexity, Claude, Bing Copilot).
 */
export function transformFaqToQuestionEntities(
  faqItems: FAQQuestionSource[]
): JsonLdQuestionEntity[] {
  if (!Array.isArray(faqItems)) return [];

  return faqItems
    .filter((item) => item && typeof item.question === 'string' && typeof item.answer === 'string')
    .map((item) => ({
      '@type': 'Question',
      name: item.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.trim(),
      },
    }));
}

/**
 * Convenience alias for transformFaqToQuestionEntities
 */
export const transformFaqQuestionsToEntities = transformFaqToQuestionEntities;

/**
 * Produces a full FAQPage JSON-LD schema object containing the transformed Question entities.
 */
export function generateFaqPageSchema(faqItems: FAQQuestionSource[]): JsonLdFaqPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: transformFaqToQuestionEntities(faqItems),
  };
}

/**
 * Automatically produces JSON-LD structured data for ContentHub articles.
 */
export function generateSchemaForArticle(article: ArticleSchemaData): string {
  const baseUrl = 'https://www.striku.cloud';
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
        url: 'https://www.striku.cloud/logo.png',
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

const FAQ_SCHEMA_SCRIPT_ID = 'striku-legal-faq-jsonld-schema';

/**
 * Injects or updates the JSON-LD FAQ schema script in document.head
 * to ensure AI search bots and Google Rich Snippet crawlers ingest the latest Question entities.
 */
export function injectFaqSchemaToHead(faqItems: FAQQuestionSource[]): void {
  if (typeof document === 'undefined') return;

  const schema = generateFaqPageSchema(faqItems);
  let script = document.getElementById(FAQ_SCHEMA_SCRIPT_ID) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement('script');
    script.id = FAQ_SCHEMA_SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.text = JSON.stringify(schema, null, 2);
}

/**
 * Unified SEOManager utility suite for structured data transformations,
 * conversational AI search optimization, and rich snippets.
 */
export const SEOManager = {
  transformFaqToQuestionEntities,
  transformFaqQuestionsToEntities,
  generateFaqPageSchema,
  generateSchemaForArticle,
  injectFaqSchemaToHead,
};

export default SEOManager;
