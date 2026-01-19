// app/actions/gamification.ts
import { db } from '@/lib/firebaseconfig'; // 👈 UPDATED to match your filename
import { doc, getDoc, setDoc } from 'firebase/firestore';

// 🏆 CONFIGURATION: Define your milestones here
const LEVEL_THRESHOLDS = [
    { level: 1, reports: 0, title: "Citizen", reward: 0 },
    { level: 2, reports: 5, title: "Civic Observer", reward: 100 },
    { level: 3, reports: 10, title: "Neighborhood Watch", reward: 500 },
    { level: 4, reports: 25, title: "Community Guardian", reward: 1000 },
    { level: 5, reports: 50, title: "City Hero", reward: 2500 },
];

export async function updateUserGamification(userId: string) {
    if (!userId) return;

    const userRef = doc(db, "user_stats", userId);
    const userSnap = await getDoc(userRef);

    // Get current stats or set defaults
    let stats = userSnap.exists() 
        ? userSnap.data() 
        : { totalReports: 0, coins: 0, level: 1, unlockedCertificates: [] };

    // 1. Increment Reports
    const newReportCount = (stats.totalReports || 0) + 1;
    let newCoins = (stats.coins || 0) + 50; // Base reward: 50 coins per report

    // 2. Check for Level Up
    let newLevel = stats.level || 1;
    let newTitle = stats.rankTitle || "Citizen";
    let newCerts = stats.unlockedCertificates || [];

    // Check milestones (reverse to find highest applicable level)
    const nextMilestone = LEVEL_THRESHOLDS.slice().reverse().find(t => newReportCount >= t.reports);

    if (nextMilestone && nextMilestone.level > newLevel) {
        // 🎉 LEVEL UP EVENT!
        newLevel = nextMilestone.level;
        newTitle = nextMilestone.title;
        newCoins += nextMilestone.reward; // Bonus coins
        
        // Unlock Certificate
        if (!newCerts.includes(nextMilestone.title)) {
            newCerts.push(nextMilestone.title);
        }
    }

    // 3. Save to Firestore
    await setDoc(userRef, {
        userId,
        totalReports: newReportCount,
        coins: newCoins,
        level: newLevel,
        rankTitle: newTitle,
        unlockedCertificates: newCerts,
        lastUpdated: new Date()
    }, { merge: true });

    return { newLevel, newCoins, newTitle };
}
