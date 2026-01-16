// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import L from 'leaflet';
// import { Link, useLocation } from 'react-router-dom';
// import MarkerClusterGroup from 'react-leaflet-markercluster'; // 👈 1. IMPORT CLUSTER GROUP

// // Import the required CSS for marker clustering
// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
// import './MapPage.css';

// // ... getPriorityIcon function remains the same ...
// const getPriorityIcon = (priority) => {
//   // (This function is unchanged from the previous version)
//   const priorityColor = { 'Critical': '#d9534f', 'High': '#f0ad4e', 'Medium': '#0275d8', 'Low': '#5cb85c', 'default': '#777' };
//   const color = priorityColor[priority] || priorityColor['default'];
//   const markerHtml = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/></svg>`;
//   return new L.DivIcon({ html: markerHtml, className: 'custom-div-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
// };

// // 👈 2. NEW: Function to create custom cluster icons based on priority
// const createClusterCustomIcon = function (cluster) {
//   const markers = cluster.getAllChildMarkers();
//   let highestPriority = 'Low'; // Default to lowest priority

//   // Determine the highest priority within the cluster
//   markers.forEach((marker) => {
//     const priority = marker.options.priority;
//     if (priority === 'Critical') highestPriority = 'Critical';
//     else if (priority === 'High' && highestPriority !== 'Critical') highestPriority = 'High';
//     else if (priority === 'Medium' && highestPriority !== 'Critical' && highestPriority !== 'High') highestPriority = 'Medium';
//   });

//   const clusterClassName = {
//     'Critical': 'critical-cluster',
//     'High': 'high-cluster',
//     'Medium': 'medium-cluster',
//     'Low': 'low-cluster',
//   };
  
//   return L.divIcon({
//     html: `<span>${cluster.getChildCount()}</span>`,
//     className: `marker-cluster ${clusterClassName[highestPriority]}`,
//     iconSize: L.point(40, 40, true),
//   });
// };


// const MapPage = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   const initialCenter = location.state?.center || [20.2961, 85.8245];
//   const initialZoom = location.state?.center ? 18 : 13;

//   useEffect(() => {
//     const q = query(collection(db, "reports"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const issuesData = querySnapshot.docs
//         .map(doc => ({ id: doc.id, ...doc.data() }))
//         .filter(issue => issue.location && typeof issue.location === 'string');
//       setIssues(issuesData);
//       setLoading(false);
//     }, (error) => console.error("Error fetching issues:", error));
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div className="p-4 text-center">Loading map data...</div>;
//   }

//   return (
//     <div className="map-page-container">
//       <h2 className="main-title p-3">Issues Map View</h2>
//       <MapContainer center={initialCenter} zoom={initialZoom} className="map-view">
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* 👇 3. WRAP MARKERS in MarkerClusterGroup */}
//         <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
//           {issues.map(issue => {
//             const position = issue.location.split(',').map(coord => parseFloat(coord.trim()));
//             if (position.length !== 2 || isNaN(position[0]) || isNaN(position[1])) {
//               return null;
//             }
//             return (
//               <Marker 
//                 key={issue.id} 
//                 position={position} 
//                 icon={getPriorityIcon(issue.priority)}
//                 priority={issue.priority} // Pass priority as an option
//               >
//                 <Popup>
//                   <div className="map-popup">
//                     <h5>{issue.type || 'N/A'}</h5>
//                     <p><strong>Status:</strong> {issue.status || 'N/A'}</p>
//                     <p><strong>Priority:</strong> {issue.priority || 'N/A'}</p>
//                     <Link to={`/issue/${issue.id}`}>View Details</Link>
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;

// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import L from 'leaflet';
// import { Link, useLocation } from 'react-router-dom';
// import MarkerClusterGroup from 'react-leaflet-markercluster';
// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
// import './MapPage.css';

// // --- 1. GEOSPATIAL HELPER FUNCTIONS ---
// const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
//   const R = 6371e3; // Radius of earth in meters
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// // Identify hotspots: Groups of 3+ issues within 50m
// const identifyHotspots = (issues) => {
//   return issues.map((currentIssue) => {
//     // Skip if resolved or invalid location
//     if (currentIssue.status === 'Resolved' || !currentIssue.location.includes(',')) {
//       return { ...currentIssue, isHotspot: false };
//     }

//     const [lat1, lon1] = currentIssue.location.split(',').map(Number);

//     // Count neighbors
//     const neighbors = issues.filter(other => {
//       if (other.id === currentIssue.id) return false;
//       if (!other.location.includes(',')) return false;
//       // Optional: Check if type matches (e.g. only group "Garbage" with "Garbage")
//       // if (other.type !== currentIssue.type) return false; 

//       const [lat2, lon2] = other.location.split(',').map(Number);
//       const distance = getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
//       return distance <= 50; // 50 meters radius
//     });

//     // If 2+ neighbors found (total 3 including self), mark as hotspot
//     return { ...currentIssue, isHotspot: neighbors.length >= 2 };
//   });
// };

// // --- 2. CUSTOM ICONS ---
// const getIcon = (priority, isHotspot) => {
//   // If it's a hotspot, override color to RED and make it pulse
//   if (isHotspot) {
//     const pulseHtml = `
//       <div style="position: relative;">
//         <div style="position: absolute; width: 40px; height: 40px; background: rgba(255, 0, 0, 0.4); border-radius: 50%; top: -4px; left: -4px; animation: pulse 1.5s infinite;"></div>
//         <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
//           <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#d9534f"/>
//           <circle cx="12" cy="9" r="2" fill="white"/> 
//         </svg>
//       </div>`;
//     return new L.DivIcon({ html: pulseHtml, className: 'custom-pulse-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
//   }

//   // Normal Icons
//   const priorityColor = { 'Critical': '#d9534f', 'High': '#f0ad4e', 'Medium': '#0275d8', 'Low': '#5cb85c', 'default': '#777' };
//   const color = priorityColor[priority] || priorityColor['default'];
//   const markerHtml = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/></svg>`;
//   return new L.DivIcon({ html: markerHtml, className: 'custom-div-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
// };

// const createClusterCustomIcon = function (cluster) {
//   const markers = cluster.getAllChildMarkers();
//   let hasHotspot = false;
//   let highestPriority = 'Low'; 

//   markers.forEach((marker) => {
//     // Check if any marker in this cluster is a Hotspot
//     if (marker.options.isHotspot) hasHotspot = true;

//     const priority = marker.options.priority;
//     if (priority === 'Critical') highestPriority = 'Critical';
//     else if (priority === 'High' && highestPriority !== 'Critical') highestPriority = 'High';
//     else if (priority === 'Medium' && highestPriority !== 'Critical' && highestPriority !== 'High') highestPriority = 'Medium';
//   });

//   // If cluster contains a hotspot, force it to look Critical/Red
//   if (hasHotspot) highestPriority = 'Critical';

//   const clusterClassName = {
//     'Critical': 'critical-cluster',
//     'High': 'high-cluster',
//     'Medium': 'medium-cluster',
//     'Low': 'low-cluster',
//   };
   
//   return L.divIcon({
//     html: `<span>${cluster.getChildCount()}</span>`,
//     className: `marker-cluster ${clusterClassName[highestPriority]}`,
//     iconSize: L.point(40, 40, true),
//   });
// };

// const MapPage = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();

//   const initialCenter = location.state?.center || [20.2961, 85.8245];
//   const initialZoom = location.state?.center ? 18 : 13;

//   useEffect(() => {
//     const q = query(collection(db, "reports"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const rawIssues = querySnapshot.docs
//         .map(doc => ({ id: doc.id, ...doc.data() }))
//         .filter(issue => issue.location && typeof issue.location === 'string');
      
//       // RUN HOTSPOT ANALYSIS
//       const processedIssues = identifyHotspots(rawIssues);
//       setIssues(processedIssues);
//       setLoading(false);
//     }, (error) => console.error("Error fetching issues:", error));
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div className="p-4 text-center">Loading map data...</div>;
//   }

//   return (
//     <div className="map-page-container">
//       <h2 className="main-title p-3">Issues Map View</h2>
//       {/* Add CSS for the pulse animation */}
//       <style>{`
//         @keyframes pulse {
//           0% { transform: scale(0.8); opacity: 1; }
//           100% { transform: scale(2); opacity: 0; }
//         }
//       `}</style>
//       <MapContainer center={initialCenter} zoom={initialZoom} className="map-view">
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
//           {issues.map(issue => {
//             const position = issue.location.split(',').map(coord => parseFloat(coord.trim()));
//             if (position.length !== 2 || isNaN(position[0]) || isNaN(position[1])) {
//               return null;
//             }
//             return (
//               <Marker 
//                 key={issue.id} 
//                 position={position} 
//                 // Use the updated icon logic
//                 icon={getIcon(issue.priority, issue.isHotspot)}
//                 priority={issue.priority}
//                 isHotspot={issue.isHotspot} // Pass this so cluster can see it
//               >
//                 <Popup>
//                   <div className="map-popup">
//                     <h5>
//                         {issue.type || 'N/A'} 
//                         {issue.isHotspot && <span className="badge bg-danger ms-2">HOTSPOT</span>}
//                     </h5>
//                     <p><strong>Status:</strong> {issue.status || 'N/A'}</p>
//                     <p><strong>Priority:</strong> {issue.priority || 'N/A'}</p>
//                     {issue.isHotspot && <p className="text-danger small fw-bold">⚠️ High density of reports in this area.</p>}
//                     <Link to={`/issue/${issue.id}`}>View Details</Link>
//                   </div>
//                 </Popup>
//               </Marker>
//             );
//           })}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;


import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import L from 'leaflet';
import { Link, useLocation } from 'react-router-dom';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './MapPage.css';

// --- 1. GEOSPATIAL HELPER FUNCTIONS ---
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radius of earth in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Identify hotspots: High Sensitivity Mode
const identifyHotspots = (issues) => {
  console.log("📍 STARTING HOTSPOT ANALYSIS...");
  
  return issues.map((currentIssue) => {
    if (currentIssue.status === 'Resolved' || !currentIssue.location.includes(',')) {
      return { ...currentIssue, isHotspot: false };
    }

    const [lat1, lon1] = currentIssue.location.split(',').map(Number);

    const neighbors = issues.filter(other => {
      if (other.id === currentIssue.id) return false;
      if (!other.location.includes(',')) return false;

      const [lat2, lon2] = other.location.split(',').map(Number);
      const distance = getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
      
      // LOGIC: If another issue is within 5000 meters (5km)
      return distance <= 5000; 
    });

    console.log(`Issue ${currentIssue.type} has ${neighbors.length} neighbors.`);

    // LOGIC: If 1 or more neighbors found (Total 2+ reports), mark RED
    const isHotspot = neighbors.length >= 1; 
    return { ...currentIssue, isHotspot };
  });
};

// --- 2. CUSTOM ICONS ---
const getIcon = (priority, isHotspot) => {
  if (isHotspot) {
    // PULSING RED ICON FOR HOTSPOTS
    const pulseHtml = `
      <div style="position: relative;">
        <div style="position: absolute; width: 50px; height: 50px; background: rgba(220, 53, 69, 0.5); border-radius: 50%; top: -8px; left: -8px; animation: pulse 1.5s infinite;"></div>
        <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#dc3545"/>
          <path d="M12 7v4" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 13h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>`;
    return new L.DivIcon({ html: pulseHtml, className: 'custom-pulse-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
  }

  // STANDARD ICONS
  const priorityColor = { 'Critical': '#d9534f', 'High': '#f0ad4e', 'Medium': '#0275d8', 'Low': '#5cb85c', 'default': '#777' };
  const color = priorityColor[priority] || priorityColor['default'];
  const markerHtml = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/></svg>`;
  return new L.DivIcon({ html: markerHtml, className: 'custom-div-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] });
};

const createClusterCustomIcon = function (cluster) {
  const markers = cluster.getAllChildMarkers();
  let hasHotspot = false;
  let highestPriority = 'Low'; 

  markers.forEach((marker) => {
    // READ THE PROPS PASSED TO THE MARKER
    if (marker.options.isHotspot) hasHotspot = true;

    const priority = marker.options.priority;
    if (priority === 'Critical') highestPriority = 'Critical';
    else if (priority === 'High' && highestPriority !== 'Critical') highestPriority = 'High';
    else if (priority === 'Medium' && highestPriority !== 'Critical' && highestPriority !== 'High') highestPriority = 'Medium';
  });

  if (hasHotspot) highestPriority = 'Critical';

  const clusterClassName = {
    'Critical': 'critical-cluster',
    'High': 'high-cluster',
    'Medium': 'medium-cluster',
    'Low': 'low-cluster',
  };
   
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: `marker-cluster ${clusterClassName[highestPriority]}`,
    iconSize: L.point(40, 40, true),
  });
};

const MapPage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const initialCenter = location.state?.center || [20.2961, 85.8245];
  const initialZoom = location.state?.center ? 18 : 13;

  useEffect(() => {
    const q = query(collection(db, "reports"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rawIssues = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(issue => issue.location && typeof issue.location === 'string');
      
      const processedIssues = identifyHotspots(rawIssues);
      setIssues(processedIssues);
      setLoading(false);
    }, (error) => console.error("Error fetching issues:", error));
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading map data...</div>;
  }

  return (
    <div className="map-page-container">
      <h2 className="main-title p-3">Issues Map View</h2>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.8); opacity: 1; }
        }
      `}</style>
      <MapContainer center={initialCenter} zoom={initialZoom} className="map-view">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
          {issues.map(issue => {
            const position = issue.location.split(',').map(coord => parseFloat(coord.trim()));
            if (position.length !== 2 || isNaN(position[0]) || isNaN(position[1])) {
              return null;
            }
            return (
              <Marker 
                key={issue.id} 
                position={position} 
                icon={getIcon(issue.priority, issue.isHotspot)}
                priority={issue.priority}
                isHotspot={issue.isHotspot} // Important for Cluster
              >
                <Popup>
                  <div className="map-popup">
                    <h5>
                        {issue.type || 'N/A'} 
                        {issue.isHotspot && <span className="badge bg-danger ms-2">HOTSPOT</span>}
                    </h5>
                    <p><strong>Status:</strong> {issue.status || 'N/A'}</p>
                    {issue.isHotspot && <p className="text-danger small fw-bold">⚠️ High Report Density (5km radius)</p>}
                    <Link to={`/issue/${issue.id}`}>View Details</Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapPage;
