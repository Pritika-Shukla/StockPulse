import { MarketNewsArticle, UserForNewsEmail } from "@/types";
import { getAllUsers } from "../actions/users.actions";
import { inngest } from "./client";
import { getNews } from "../actions/finnhub.actions";
import { getWatchlistByEmail } from "../actions/watchlist.actions";
import { NEWS_SUMMARY_EMAIL_PROMPT } from "./prompt";

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
    const results = await step.run("fetch-user-news", async () => {
      const perUser: Array<{
        user: UserForNewsEmail;
        articles: MarketNewsArticle[];
      }> = [];
      
      for (const user of users) {
        try {
          const symbols = await getWatchlistByEmail(user.email);
          let articles = await getNews(symbols as string[]);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }

          // Transform user to UserForNewsEmail format
          const userForNews: UserForNewsEmail = {
            id: user.id,
            email: user.email,
            watchlist: symbols || [],
          };

          perUser.push({ user: userForNews, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);

          // Transform user to UserForNewsEmail format even on error
          const userForNews: UserForNewsEmail = {
            id: user.id,
            email: user.email,
            watchlist: [],
          };

          perUser.push({ user: userForNews, articles: [] });
        }
      }

      return perUser;
    });

    // Summarize news via AI 
    const userNewsSummary: {user: UserForNewsEmail; newsContent: string}[] = [];

    for (const {user, articles} of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.openai({ model: "gpt-4o-mini" }),
          body: {
            messages: [{ role: "user", content: prompt }]
          }
        });


        const newsContent = response.choices?.[0]?.message?.content || 'No market news.';
        userNewsSummary.push({ user, newsContent });
      } catch(e) {
        console.error("daily-news: error summarizing user news", user.email, e);
        userNewsSummary.push({ user, newsContent: "Error summarizing news"});
      }
    }

    return { success: true, message: "Daily summary sent", data: results };
  }
);
