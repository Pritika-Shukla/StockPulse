export const runtime = "nodejs";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { ClerkUser } from "@/types";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();

  const svixHeaders = {
    "svix-id": headerList.get("svix-id") || "",
    "svix-timestamp": headerList.get("svix-timestamp") || "",
    "svix-signature": headerList.get("svix-signature") || "",
  };

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY!);

    // ✅ Proper typing
    const evt = wh.verify(body, svixHeaders) as WebhookEvent;

    // Type-safe event data
    const eventType = evt.type;
    const userData = evt.data as unknown as ClerkUser;

    if (eventType === "user.created") {
      const email = userData.email_addresses?.[0]?.email_address;

      await prisma.user.create({
        data:{  
          clerkId: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: email,
          imageUrl: userData.image_url,
          createdAt: new Date(userData.created_at),
          updatedAt: new Date(userData.updated_at),
        }
      });
      console.log(`✅ User ${userData.id} was created`);
      console.log(userData);
    } else {
      console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return NextResponse.json(
      { success: true, message: "Webhook received" },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Webhook verification failed:", err.message);
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unknown error" },
      { status: 500 }
    );
  }
}
