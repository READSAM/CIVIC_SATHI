// src/lib/trafficOracle.js
import roadData from '../data/major_roads.json';

// Helper: Calculate distance between a Point (p) and a Line Segment (v, w)
const distToSegmentSquared = (p, v, w) => {
    const l2 = (v[0] - w[0])**2 + (v[1] - w[1])**2;
    if (l2 === 0) return (p[0] - v[0])**2 + (p[1] - v[1])**2;
    let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    return (p[0] - v[0] - t * (w[0] - v[0]))**2 + (p[1] - v[1] - t * (w[1] - v[1]))**2;
};

const distToSegment = (p, v, w) => {
    return Math.sqrt(distToSegmentSquared(p, v, w));
};

// Main Function: Check if location is near a major road
export const getTrafficProfile = (locationString) => {
    // 1. Debug Log: Start
    console.log("🚦 ORACLE START: Analyzing location:", locationString);

    if (!locationString || !locationString.includes(',')) {
        console.error("❌ ORACLE ERROR: Invalid location format");
        return null;
    }

    // 2. Parse Coordinates
    const [reportLat, reportLon] = locationString.split(',').map(Number);
    
    // Safety check for NaN
    if (isNaN(reportLat) || isNaN(reportLon)) {
        console.error("❌ ORACLE ERROR: Coordinates are not numbers");
        return null;
    }

    // 3. Loop through roads
    for (const feature of roadData.features) {
        const roadType = feature.properties.highway; 
        const coordinates = feature.geometry.coordinates;
        
        for (let i = 0; i < coordinates.length - 1; i++) {
            const p1 = coordinates[i];     // [lon, lat]
            const p2 = coordinates[i + 1]; // [lon, lat]

            // Calculate Distance
            const distDegrees = distToSegment([reportLon, reportLat], p1, p2);
            
            // 4. LOGGING CLOSE MATCHES
            // If it's somewhat close (within ~500m), log it so we know logic works
            if (distDegrees < 0.005) {
                console.log(`🔍 Close to ${feature.properties.name || 'Road'}: ${distDegrees.toFixed(5)}`);
            }

            // 5. RELAXED THRESHOLD MATCH
            // Changed from 0.0003 to 0.002 (Approx 200 meters)
            if (distDegrees < 0.002) {
                
                console.log("✅ MATCH FOUND! Road:", feature.properties.name);

                let urgency = "HIGH";
                let desc = "This is a key arterial road.";
                let color = "warning";

                if (roadType === 'trunk' || roadType === 'primary') {
                    urgency = "CRITICAL";
                    desc = "This is a MAIN HIGHWAY carrying heavy city traffic.";
                    color = "danger";
                } else if (roadType === 'secondary') {
                    urgency = "HIGH";
                    desc = "This is a major connector road.";
                    color = "warning";
                }

                return {
                    level: urgency,
                    label: `${roadType.toUpperCase()} ROAD DETECTED`,
                    description: desc,
                    color: color,
                    roadName: feature.properties.name || "Unnamed Major Road"
                };
            }
        }
    }

    // If no match found
    console.log("⚠️ No Match Found. Returning Local Street.");
    return {
        level: "LOW",
        label: "Local Street",
        description: "Traffic likely local or residential.",
        color: "success"
    };
};
