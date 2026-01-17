// src/lib/intelligence.js

// 1. HARDCODED "KNOWLEDGE BASE"
// This simulates the AI knowing where important things are in Bhubaneswar.
const CITY_ZONES = [
    // 🚦 HIGH TRAFFIC ZONES (Intersections, Markets)
    { 
        name: "Patia Chowk (Main Square)", 
        lat: 20.3588, 
        lon: 85.8189, 
        radius: 800, // 800m influence
        tags: ["High Traffic", "Commercial"] 
    },
    { 
        name: "Master Canteen Area", 
        lat: 20.2667, 
        lon: 85.8430, 
        radius: 1000, 
        tags: ["High Traffic", "VIP Route"] 
    },

    // 🌊 FLOOD PRONE ZONES (Low-lying areas)
    { 
        name: "Acharya Vihar Lowlands", 
        lat: 20.2936, 
        lon: 85.8327, 
        radius: 600, 
        tags: ["Flood Prone", "Drainage Issue"] 
    },
    { 
        name: "Rasulgarh Canal Side", 
        lat: 20.2850, 
        lon: 85.8580, 
        radius: 500, 
        tags: ["Flood Prone"] 
    },

    // 🎓 SENSITIVE ZONES (Schools, Hospitals)
    { 
        name: "KIIT University Campus", 
        lat: 20.3533, 
        lon: 85.8186, 
        radius: 1200, 
        tags: ["School Zone", "High Pedestrian"] 
    },
    { 
        name: "Capital Hospital", 
        lat: 20.2700, 
        lon: 85.8400, 
        radius: 800, 
        tags: ["Hospital Zone", "Silence Zone"] 
    }
];

// Helper: Haversine Distance Calculation (Meters)
const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// 2. UNIVERSAL TRAFFIC ENGINE 🚗
// Calculates traffic based on Time of Day + Coordinate Hash (Simulation)
const calculateTrafficDensity = (lat, lon) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    // A. TIME FACTOR (Rush Hours are universal)
    let timeMultiplier = 1.0;
    
    // Morning Rush (8 AM - 11 AM) or Evening Rush (5 PM - 8 PM)
    if ((currentHour >= 8 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 20)) {
        // Weekdays only
        if (currentDay !== 0 && currentDay !== 6) {
            timeMultiplier = 2.0; // Double the traffic score
        }
    }

    // B. LOCATION HASH FACTOR (Consistent "Randomness")
    // We sum the decimal parts of lat/lon to create a unique "fingerprint" for this location
    const uniqueVal = (Math.abs(lat) + Math.abs(lon)) * 10000; 
    const baseTrafficScore = Math.floor(uniqueVal % 100); // Result is 0 to 99

    // C. FINAL SCORE
    return baseTrafficScore * timeMultiplier;
};

// --- MAIN FUNCTION EXPORTED TO YOUR APP ---
export const analyzeIssueContext = async (issue) => {
    const insights = [];
    
    // Safety Check: Ensure location exists
    if (!issue.location || !issue.location.includes(',')) return insights;

    const [lat, lon] = issue.location.split(',').map(Number);

    // --- 1. CHECK "STATIC" ZONES (Hardcoded Knowledge) ---
    CITY_ZONES.forEach(zone => {
        const dist = getDistance(lat, lon, zone.lat, zone.lon);

        // CHECK IF ISSUE IS INSIDE THE ZONE
        if (dist <= zone.radius) {
            
            // A. FLOOD/DRAINAGE CORRELATION 🌊
            if (zone.tags.includes("Flood Prone") && ['Garbage', 'Drainage', 'Water'].includes(issue.type)) {
                insights.push({
                    title: "Flood Prevention Alert",
                    type: "Disaster",
                    color: "warning", // Yellow Alert
                    message: `Urgent: ${zone.name} is a known flood zone. Blocking drains here causes immediate waterlogging.`,
                    icon: "⛈️"
                });
            }

            // B. VULNERABLE POPULATION 🎓
            if ((zone.tags.includes("School Zone") || zone.tags.includes("Hospital Zone")) && 
                ['Streetlight', 'Pothole', 'Sanitation', 'Safety'].includes(issue.type)) {
                insights.push({
                    title: "Vulnerable Zone Risk",
                    type: "Safety",
                    color: "info", // Blue Alert
                    message: `Proximity Alert: Located ${dist.toFixed(0)}m from ${zone.name}. Priority for student/patient safety.`,
                    icon: "🎓"
                });
            }
        }
    });

    // --- 2. CHECK "DYNAMIC" TRAFFIC (Simulation) ---
    const trafficScore = calculateTrafficDensity(lat, lon);
    
    // If Traffic Score is High (> 120), it's a Congestion Zone
    if (trafficScore > 120 && ['Pothole', 'Streetlight', 'Accident'].includes(issue.type)) {
        insights.push({
            title: "Peak Hour Traffic Hazard",
            type: "Traffic",
            color: "danger", // Red Card
            message: `High Traffic Detected (Score: ${trafficScore.toFixed(0)}). Repair urgently to avoid gridlock.`,
            icon: "🚗"
        });
    }

    return insights;
};
