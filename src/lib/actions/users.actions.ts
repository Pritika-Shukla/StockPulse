import { prisma } from "../prisma";
import { User } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    console.log("Users fetched successfully", users);
    return users;
  } catch (error) {
    console.error("Error getting all users", error);
    return [];
  }
};

/**
 * Gets the current user's email address
 * @returns The user's email address or null if not found
 */
export const getUserEmail = async (): Promise<string | null> => {
  try {
    // First, try to get email from session claims
    const { sessionClaims } = await auth();
    const emailFromSession = sessionClaims?.email as string | undefined;
    
    if (emailFromSession) {
      return emailFromSession;
    }

    // Fallback: try to get from currentUser
    const user = await currentUser();
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }

    // Last resort: get from database using userId
    const { userId } = await auth();
    if (userId) {
      const dbUser = await prisma.user.findFirst({
        where: { clerkId: userId },
        select: { email: true },
      });
      if (dbUser?.email) {
        return dbUser.email;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user email", error);
    return null;
  }
};
