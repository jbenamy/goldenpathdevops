import rss from '@astrojs/rss';
import { getEntries } from '@lib/contentParser';
import { sortByDate } from '@lib/sortFunctions';
import type { BlogEntry } from '@/types';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const entries = (await getEntries('blog', sortByDate)) as BlogEntry[];

  return rss({
    title: 'Golden Path DevOps',
    description: 'DevOps insights, best practices, and the golden path to cloud infrastructure',
    site: context.site || 'https://goldenpathdevops.io',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description || '',
      pubDate: entry.data.date || new Date(),
      link: `/blog/${entry.id}/`,
      categories: [
        ...(entry.data.categories || []),
        ...(entry.data.tags || []),
      ],
      author: entry.data.author || 'Golden Path DevOps',
    })),
    customData: `<language>en-us</language>`,
  });
}
