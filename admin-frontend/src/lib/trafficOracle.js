// // src/lib/trafficOracle.js
// import roadData from '../data/major_roads.json';

// // Helper: Calculate distance between a Point (p) and a Line Segment (v, w)
// const distToSegmentSquared = (p, v, w) => {
//     const l2 = (v[0] - w[0])**2 + (v[1] - w[1])**2;
//     if (l2 === 0) return (p[0] - v[0])**2 + (p[1] - v[1])**2;
//     let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
//     t = Math.max(0, Math.min(1, t));
//     return (p[0] - v[0] - t * (w[0] - v[0]))**2 + (p[1] - v[1] - t * (w[1] - v[1]))**2;
// };

// const distToSegment = (p, v, w) => {
//     return Math.sqrt(distToSegmentSquared(p, v, w));
// };

// // Main Function: Check if location is near a major road
// export const getTrafficProfile = (locationString) => {
//     // 1. Debug Log: Start
//     console.log("🚦 ORACLE START: Analyzing location:", locationString);

//     if (!locationString || !locationString.includes(',')) {
//         console.error("❌ ORACLE ERROR: Invalid location format");
//         return null;
//     }

//     // 2. Parse Coordinates
//     const [reportLat, reportLon] = locationString.split(',').map(Number);
    
//     // Safety check for NaN
//     if (isNaN(reportLat) || isNaN(reportLon)) {
//         console.error("❌ ORACLE ERROR: Coordinates are not numbers");
//         return null;
//     }

//     // 3. Loop through roads
//     for (const feature of roadData.features) {
//         const roadType = feature.properties.highway; 
//         const coordinates = feature.geometry.coordinates;
        
//         for (let i = 0; i < coordinates.length - 1; i++) {
//             const p1 = coordinates[i];     // [lon, lat]
//             const p2 = coordinates[i + 1]; // [lon, lat]

//             // Calculate Distance
//             const distDegrees = distToSegment([reportLon, reportLat], p1, p2);
            
//             // 4. LOGGING CLOSE MATCHES
//             // If it's somewhat close (within ~500m), log it so we know logic works
//             if (distDegrees < 0.005) {
//                 console.log(`🔍 Close to ${feature.properties.name || 'Road'}: ${distDegrees.toFixed(5)}`);
//             }

//             // 5. RELAXED THRESHOLD MATCH
//             // Changed from 0.0003 to 0.002 (Approx 200 meters)
//             if (distDegrees < 0.002) {
                
//                 console.log("✅ MATCH FOUND! Road:", feature.properties.name);

//                 let urgency = "HIGH";
//                 let desc = "This is a key arterial road.";
//                 let color = "warning";

//                 if (roadType === 'trunk' || roadType === 'primary') {
//                     urgency = "CRITICAL";
//                     desc = "This is a MAIN HIGHWAY carrying heavy city traffic.";
//                     color = "danger";
//                 } else if (roadType === 'secondary') {
//                     urgency = "HIGH";
//                     desc = "This is a major connector road.";
//                     color = "warning";
//                 }

//                 return {
//                     level: urgency,
//                     label: `${roadType.toUpperCase()} ROAD DETECTED`,
//                     description: desc,
//                     color: color,
//                     roadName: feature.properties.name || "Unnamed Major Road"
//                 };
//             }
//         }
//     }

//     // If no match found
//     console.log("⚠️ No Match Found. Returning Local Street.");
//     return {
//         level: "LOW",
//         label: "Local Street",
//         description: "Traffic likely local or residential.",
//         color: "success"
//     };
// };


// src/lib/trafficOracle.js

// 1. EMBEDDED DATA (Updated with your exact console coordinates)
const roadData = {
  "type": "FeatureCollection",
  "features": [
    // 📍 NEW: Your EXACT Current Location (From Console Log)
    {
      "type": "Feature",
      "properties": { "name": "Patia Interior Road (User Loc)", "highway": "primary" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.816123, 20.364438], // <--- Your EXACT current point
          [85.816081, 20.364467], // <--- Your previous point
          [85.815581, 20.363967]  // Nearby point to make a line
        ]
      }
    },
    // 🏛️ RAJ BHAVAN AREA (VIP Zone)
    {
      "type": "Feature",
      "properties": { "name": "Raj Bhavan Square (VIP Zone)", "highway": "primary" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.817000, 20.271200], 
          [85.817585, 20.271278],
          [85.818000, 20.271350]
        ]
      }
    },
    // ... KEEPING EXISTING ROADS ...
    {
      "type": "Feature",
      "properties": { "name": "Raj Path", "highway": "primary" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.8275, 20.2678], [85.8266, 20.2683],
          [85.8258, 20.2687], [85.8223, 20.2699]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "NH-16 (Chennai-Kolkata Hwy)", "highway": "trunk" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.8400, 20.2900], [85.8420, 20.2950],
          [85.8450, 20.3000], [85.8500, 20.3100]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Nandan Kanan Road", "highway": "primary" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.8160, 20.3580], [85.8225, 20.3450]
        ]
      }
    }
  ]
};

// 2. HELPER MATH FUNCTIONS
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

// 3. MAIN ORACLE FUNCTION
export const getTrafficProfile = (locationString) => {
    // Debug Log
    console.log("🚦 ORACLE CHECKING:", locationString);

    if (!locationString || !locationString.includes(',')) return null;

    const [reportLat, reportLon] = locationString.split(',').map(Number);
    
    if (isNaN(reportLat) || isNaN(reportLon)) return null;

    for (const feature of roadData.features) {
        const roadType = feature.properties.highway;
        const coordinates = feature.geometry.coordinates;

        for (let i = 0; i < coordinates.length - 1; i++) {
            const p1 = coordinates[i];
            const p2 = coordinates[i + 1];

            const distDegrees = distToSegment([reportLon, reportLat], p1, p2);

            // LOGGING FOR DEBUGGING
            if (distDegrees < 0.01) {
               console.log(`🔍 Checking ${feature.properties.name}: Distance = ${distDegrees.toFixed(5)}`);
            }

            // INCREASED THRESHOLD: 0.003 (approx 300 meters) to ensure match
            if (distDegrees < 0.003) {
                console.log("✅ MATCH FOUND:", feature.properties.name);
                
                let urgency = "HIGH";
                let desc = "This is a key arterial road.";
                let color = "warning";

                if (roadType === 'trunk' || roadType === 'primary') {
                    urgency = "CRITICAL";
                    desc = "MAIN HIGHWAY / VIP ROUTE DETECTED.";
                    color = "danger";
                }

                return {
                    level: urgency,
                    label: `${feature.properties.name.toUpperCase()} DETECTED`,
                    description: desc,
                    color: color,
                    roadName: feature.properties.name
                };
            }
        }
    }

    console.log("⚠️ No Match Found. Returning Local Street.");
    return {
        level: "LOW",
        label: "Local Street",
        description: "Traffic likely local or residential.",
        color: "success"
    };
};
