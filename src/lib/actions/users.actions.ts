import { prisma } from "../prisma";
import { User } from "@prisma/client";
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
