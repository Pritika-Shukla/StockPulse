import { MarketNewsArticle, UserForNewsEmail } from "@/types";
import { getAllUsers } from "../actions/users.actions";
import { inngest } from "./client";
import { getNews } from "../actions/finnhub.actions";
import { getWatchlistByEmail } from "../actions/watchlist.actions";
import { NEWS_SUMMARY_EMAIL_PROMPT } from "./prompt";
import { sendNewsSummaryEmail } from "../nodemailer";
import { getFormattedTodayDate } from "../utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "send-daily-news-summary" },
  [{ event: "app/daily-summary" }, { cron: "0 12 * * *" }],
  async ({ step }) => {
    const users = await step.run("get-all-users", getAllUsers);

    if (!users || users.length === 0) {
      return { success: false, message: "No users found" };
    }

    // Fetch general news once for all users to reduce API calls
    const generalNews = await step.run("fetch-general-news", async () => {
      try {
        return await getNews();
      } catch (e) {
        console.error("Error fetching general news:", e);
        return [];
      }
    });

    // Process each user's news
    const userNewsSummary: {user: UserForNewsEmail; newsContent: string}[] = [];

    for (const user of users) {
      const userNews = await step.run(`fetch-user-news-${user.id}`, async () => {
        try {
          const symbols = await getWatchlistByEmail(user.email);
          let articles: MarketNewsArticle[] = [];

          // Try to get watchlist-specific news first
          if (symbols && symbols.length > 0) {
            try {
              articles = await getNews(symbols as string[]);
            } catch (e) {
              console.error(`Error fetching watchlist news for ${user.email}:`, e);
            }
          }

          // If no watchlist news or empty, use general news
          if (!articles || articles.length === 0) {
            articles = generalNews.slice(0, 6);
          } else {
            articles = articles.slice(0, 6);
          }

          return {
            user: {
              id: user.id,
              email: user.email,
              watchlist: symbols || [],
            },
            articles
          };
        } catch (e) {
          console.error("Error preparing user news for", user.email, e);
          return {
            user: {
              id: user.id,
              email: user.email,
              watchlist: [],
            },
            articles: generalNews.slice(0, 6)
          };
        }
      });

      // Summarize news via AI
      let newsContent = 'No market news.';
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(userNews.articles, null, 2));
        const summary = await step.ai.infer(`ai-summarize-${user.id}`, {
          model: step.ai.models.openai({ model: "gpt-4o-mini" }),
          body: {
            messages: [{ role: "user", content: prompt }]
          }
        });

        newsContent = summary.choices?.[0]?.message?.content || 'No market news.';
      } catch(e) {
        console.error("Error summarizing news for", user.email, e);
        newsContent = "Error summarizing news";
      }

      userNewsSummary.push({ 
        user: userNews.user, 
        newsContent: newsContent 
      });
    }

    // Send emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummary.map(async ({ user, newsContent}) => {
          if(!newsContent) return false;
          return await sendNewsSummaryEmail({ 
            email: user.email, 
            date: getFormattedTodayDate(), 
            newsContent 
          });
        })
      );
    });

    return { success: true, message: 'Daily news summary emails sent successfully' };
  }
);
