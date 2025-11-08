export const PAGE_FILE_MAP: Record<string, string> = {
  '/': 'src/components/HomePage.tsx',
  '/about': 'src/components/AboutPage.tsx',
  '/blog': 'src/components/BlogPage.tsx',
  '/podcast': 'src/components/PodcastPage.tsx',
  '/contact': 'src/components/Contact.tsx',
  '/booking': 'src/components/BookingPage.tsx',
  '/vision-builder': 'src/components/VisionBuilderPage.tsx',
  '/guests': 'src/components/GuestsDirectoryPage.tsx',
  '/podcast-guest': 'src/components/PodcastGuestPage.tsx',
  '/podcast-guest-form': 'src/components/PodcastGuestFormPage.tsx',
  '/podcast-guest-onboarding': 'src/components/PodcastGuestOnboardingPage.tsx',
  '/privacy-policy': 'src/components/PrivacyPolicy.tsx',
  '/emotional-release-techniques': 'src/components/EmotionalReleaseTechniques.tsx',
  '/rise-course-resources': 'src/components/RiseCourseResources.tsx',
  '/link': 'src/components/LinkPage.tsx'
};

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  locality?: string;
  region?: string;
}

export async function readComponentFile(pagePath: string): Promise<string> {
  const filePath = PAGE_FILE_MAP[pagePath];

  if (!filePath) {
    throw new Error(`No file mapping found for page path: ${pagePath}`);
  }

  throw new Error('File reading is handled by Bolt Cloud environment');
}

export async function writeComponentFile(pagePath: string, content: string): Promise<void> {
  const filePath = PAGE_FILE_MAP[pagePath];

  if (!filePath) {
    throw new Error(`No file mapping found for page path: ${pagePath}`);
  }

  console.log(`Would write to ${filePath}`);
  console.log('File writing is handled by Bolt Cloud environment');
}

function escapeForJSX(value: string): string {
  return value.replace(/"/g, '\\"');
}

function formatPropValue(value: string | undefined): string {
  if (!value) return '""';
  return `"${escapeForJSX(value)}"`;
}

export function parseAndUpdateSEOHead(fileContent: string, metadata: SEOMetadata): string {
  const seoHeadRegex = /<SEOHead\s+([^>]*?)\/>/gs;

  const match = seoHeadRegex.exec(fileContent);

  if (!match) {
    throw new Error('SEOHead component not found in file');
  }

  const newSEOHead = `<SEOHead
        title=${formatPropValue(metadata.title)}
        description=${formatPropValue(metadata.description)}
        ${metadata.keywords ? `keywords=${formatPropValue(metadata.keywords)}\n        ` : ''}ogImage=${formatPropValue(metadata.ogImage)}
        ${metadata.canonical ? `canonical=${formatPropValue(metadata.canonical)}\n        ` : ''}${metadata.locality ? `locality=${formatPropValue(metadata.locality)}\n        ` : ''}${metadata.region ? `region=${formatPropValue(metadata.region)}\n        ` : ''}/>`;

  const updatedContent = fileContent.replace(seoHeadRegex, newSEOHead);

  return updatedContent;
}

export async function updatePageSEO(pagePath: string, metadata: SEOMetadata): Promise<void> {
  console.log('SEO update requested for:', pagePath);
  console.log('Metadata:', metadata);
  console.log('Note: In Bolt Cloud, Claude will update files directly using Edit tool');
  console.log('This is a placeholder function that indicates intent');
}

export function getComponentFileName(pagePath: string): string {
  const filePath = PAGE_FILE_MAP[pagePath];
  if (!filePath) return 'Unknown';
  const parts = filePath.split('/');
  return parts[parts.length - 1];
}

export function extractCurrentSEOData(fileContent: string): SEOMetadata | null {
  const seoHeadRegex = /<SEOHead\s+([^>]*?)\/>/gs;
  const match = seoHeadRegex.exec(fileContent);

  if (!match) return null;

  const propsString = match[1];

  const extractProp = (propName: string): string | undefined => {
    const regex = new RegExp(`${propName}=(?:{[^}]*}|"([^"]*)"|'([^']*)')`, 'i');
    const propMatch = regex.exec(propsString);
    return propMatch ? (propMatch[1] || propMatch[2] || '') : undefined;
  };

  return {
    title: extractProp('title') || '',
    description: extractProp('description') || '',
    keywords: extractProp('keywords'),
    ogImage: extractProp('ogImage'),
    canonical: extractProp('canonical'),
    locality: extractProp('locality'),
    region: extractProp('region')
  };
}
