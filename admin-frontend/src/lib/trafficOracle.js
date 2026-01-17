const roadData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Patia Interior Road (High Priority)", "highway": "primary" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.815581, 20.363967], 
          [85.816081, 20.364467], 
          [85.816581, 20.364967]  
        ]
      }
    },
    {
      "type": "Feature",
      "properties":{"name": "Patia College Road", "highway": "secondary"},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [85.815581, 20.364967],
          [85.816581, 20.363967]
        ]
      }
    },
    //VIP Zone
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

//Main function
export const getTrafficProfile = (locationString) => {
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

            // Relaxed Threshold (~250m)
            if (distDegrees < 0.0025) {
                console.log("MATCH: ", feature.properties.name);
                

                let urgency = "HIGH";
                let desc = "Important city road detected.";
                let color = "warning"; 

         
                if (roadType === 'trunk' || feature.properties.name.includes("VIP")) {
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

    return {
        level: "LOW",
        label: "Local Street",
        description: "Traffic likely local or residential.",
        color: "success"
    };
};
