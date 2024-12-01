import Exa from "exa-js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const exa = new Exa(process.env.NEXT_PUBLIC_EXA_API_KEY);

export async function fetchAndStoreNews(hashtag, startDate) {
  try {
    // Check if we already have recent news for this hashtag
    console.log("fetching news for hashtag", hashtag)
    const existingNews = await prisma.news.findFirst({
      where: {
        hashtag: `#${hashtag.toLowerCase()}`,
        created_at: {
          gte: new Date(startDate || Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    if (existingNews) {
      return existingNews.news_json;
    }

    // Fetch new data if we don't have recent news
    const result = await exa.searchAndContents(hashtag, {
      type: "auto",
      category: "news",
      startPublishedDate: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      highlights: true,
      summary: true,
      numResults: 25
    });

    // Process and store results
    const processedResults = result.results
      .filter(item => item.title && item.summary) // Skip empty entries
      .map(item => ({
        title: item.title,
        url: item.url,
        publishedDate: item.publishedDate,
        summary: item.summary,
        author: item.author || "Unknown"
      }));

    if (processedResults.length > 0) {
      await prisma.news.create({
        data: {
          hashtag: `#${hashtag.toLowerCase()}`,
          news_json: processedResults,
          date: new Date()
        }
      });
    }

    return processedResults;
  } catch (error) {
    console.error('Error in fetchAndStoreNews:', error);
    throw error;
  }
}