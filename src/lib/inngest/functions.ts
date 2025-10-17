import { getAllUsers } from "../actions/users.actions";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
    {id: "send-daily-news-summary"},
   [ {event: "app/daily-summary"}, {cron: "0 12 * * *"}],
   async ({step}) => {
    const users = await step.run("get-all-users", getAllUsers);

    if(!users || users.length === 0) {
      return { success: false, message: "No users found" };
    }
    
    return { success: true, message: "Daily summary sent" };
  },
);