'use server';

import { prisma } from "../prisma";
import { auth } from "@clerk/nextjs/server";
import { Watchlist } from "@prisma/client";

export async function getWatchlistByEmail(email: string): Promise<string[]> {
    try {
        const user = await prisma.user.findFirst({
            where: { email },
            include: { watchlist: true },
        });
        
        return user?.watchlist.map(item => item.symbol) || [];
    }
    catch(error) {
        console.error("Error getting watchlist by email", error);
        return [];
    }
}

export async function getWatchlistItems(): Promise<Watchlist[]> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return [];
        }

        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
            include: { watchlist: true },
        });
        
        return user?.watchlist || [];
    } catch(error) {
        console.error("Error getting watchlist items", error);
        return [];
    }
}

export async function addToWatchlist(symbol: string, company: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Check if already in watchlist
        const existing = await prisma.watchlist.findUnique({
            where: {
                userId_symbol: {
                    userId: user.id,
                    symbol: symbol.toUpperCase(),
                },
            },
        });

        if (existing) {
            return { success: false, error: "Already in watchlist" };
        }

        await prisma.watchlist.create({
            data: {
                userId: user.id,
                symbol: symbol.toUpperCase(),
                company: company,
            },
        });

        return { success: true };
    } catch(error) {
        console.error("Error adding to watchlist", error);
        return { success: false, error: "Failed to add to watchlist" };
    }
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, error: "Unauthorized" };
        }

        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        await prisma.watchlist.deleteMany({
            where: {
                userId: user.id,
                symbol: symbol.toUpperCase(),
            },
        });

        return { success: true };
    } catch(error) {
        console.error("Error removing from watchlist", error);
        return { success: false, error: "Failed to remove from watchlist" };
    }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
    try {
        const { userId } = await auth();
        if (!userId) {
            return false;
        }

        const user = await prisma.user.findFirst({
            where: { clerkId: userId },
        });

        if (!user) {
            return false;
        }

        const watchlistItem = await prisma.watchlist.findUnique({
            where: {
                userId_symbol: {
                    userId: user.id,
                    symbol: symbol.toUpperCase(),
                },
            },
        });

        return !!watchlistItem;
    } catch(error) {
        console.error("Error checking watchlist", error);
        return false;
    }
}