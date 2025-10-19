'use server';

import { prisma } from "../prisma";
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