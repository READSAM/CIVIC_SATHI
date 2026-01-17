const CITY_ZONES = [
    { 
        name:"Raj Bhavan Square", 
        lat:20.271278, 
        lon:85.817585,
        radius: 800, //range of issues report marked same
        tags:["Flood Prone", "Drainage Issue", "drainage", "leak", "water", "paani", "Paani", "Pani", "Pipe", "pipe", "water_leak"] 
    },
    { 
        name:"KIIT University", 
        lat:20.3533, 
        lon:85.8186, 
        radius:1200, 
        tags:["School Zone", "High Pedestrian", "traffic", "Traffic", "Heavy traffic", "heavy traffic", "Schhol", "kids"] 
    },
    { 
        name:"Capital Hospital", 
        lat:20.2700, 
        lon:85.8400, 
        radius:800, 
        tags:["Hospital Zone", "Silence Zone"] 
    }
];

//calculate distance between two GPS points
const getDistance = (lat1,lon1,lat2,lon2) => {
    const R = 6371e3; //earth rad in m
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;
};

export const analyzeIssueContext=async (issue) => {
    const insights=[];
    
    // Safety Check: If no location, stop.
    if (!issue.location || !issue.location.includes(',')) return insights;
    
    const [lat,lon] = issue.location.split(',').map(Number);
    const weatherCondition="Rainy"; 

    CITY_ZONES.forEach(zone => {
        const dist = getDistance(lat, lon, zone.lat, zone.lon);
        // CHECK IF ISSUE IS INSIDE THE ZONE
        if (dist <= zone.radius) {
            
            // MONSOON : major issues (Garbage + Flood Zone + Rain) 
            // If it's a "Water", "Garbage", or "Drainage" issue
            if (zone.tags.includes("Flood Prone") && ['Garbage', 'Drainage', 'Water', 'Sanitation'].some(t => issue.type.includes(t))) {
                if (weatherCondition === "Rainy") {
                    insights.push({
                        title: "⛈️ MONSOON PROTOCOL ACTIVATED",
                        type: "Disaster",
                        color: "danger", //signifies the red alert
                        message: `CRITICAL: Heavy Rain detected. Immediate removal required to prevent urban flooding at ${zone.name}.`,
                        icon: "🌊"
                    });
                }
            }

            // CHILD SAFETY  major issues : Streetlight/Pothole + School
            if (zone.tags.includes("School Zone") && ['Streetlight', 'Pothole', 'Safety', 'Road'].some(t => issue.type.includes(t))) {
                insights.push({
                    title: "🎓 Child Safety Protocol",
                    type: "Safety",
                    color: "info", //informs as blue alert
                    message: `High Priority: Issue located ${dist.toFixed(0)}m from ${zone.name}. Risk to students detected.`,
                    icon: "🚸"
                });
            }
        }
    });

    return insights;
};
