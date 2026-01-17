// // import React from 'react';
// // import { Card, Row, Col } from 'react-bootstrap';
// // import { BsArrowUp, BsArrowDown } from 'react-icons/bs';

// // const DashboardPage = () => {
// //   return (
// //     <div className="dashboard-page">
// //       <h2 className="main-title">Municipal Dashboard</h2>
// //       <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
      
// //       <Row className="summary-cards mt-4 g-4">
// //         <Col md={3}>
// //           <Card className="summary-card">
// //             <Card.Body>
// //               <div className="d-flex align-items-center mb-2">
// //                 <span className="card-title me-2">Total Issues Reported</span>
// //                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
// //               </div>
// //               <h3 className="card-value">3</h3>
// //               <p className="card-trend text-danger">
// //                 <BsArrowUp /> 12% from last month
// //               </p>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //         <Col md={3}>
// //           <Card className="summary-card">
// //             <Card.Body>
// //               <div className="d-flex align-items-center mb-2">
// //                 <span className="card-title me-2">Open Issues</span>
// //                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
// //               </div>
// //               <h3 className="card-value">1</h3>
// //               <p className="card-trend text-danger">
// //                 <BsArrowUp /> +1 requires attention
// //               </p>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //         <Col md={3}>
// //           <Card className="summary-card">
// //             <Card.Body>
// //               <div className="d-flex align-items-center mb-2">
// //                 <span className="card-title me-2">Resolved Issues</span>
// //                 <i className="bi bi-check-circle-fill icon-success"></i>
// //               </div>
// //               <h3 className="card-value">1</h3>
// //               <p className="card-trend text-muted">
// //                 33% resolution rate
// //               </p>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //         <Col md={3}>
// //           <Card className="summary-card">
// //             <Card.Body>
// //               <div className="d-flex align-items-center mb-2">
// //                 <span className="card-title me-2">Avg. Response Time</span>
// //                 <i className="bi bi-clock-fill icon-info"></i>
// //               </div>
// //               <h3 className="card-value">2.9d</h3>
// //               <p className="card-trend text-success">
// //                 <BsArrowDown /> -15min from last week
// //               </p>
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>

// //       <div className="recent-alerts mt-5">
// //         <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
// //         <Card className="alert-card mb-3">
// //           <Card.Body>
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="mb-1">Large pothole on Main Street <span className="badge-high">High</span></h5>
// //                 <p className="mb-0 text-muted">There is a large pothole causing damage to vehicles near the intersection of Main St and Oak Ave.</p>
// //                 <div className="alert-meta mt-2">
// //                   <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>123 Main Street, Downtown</span>
// //                   <span><i className="bi bi-clock me-1"></i>610 days ago</span>
// //                 </div>
// //               </div>
// //               <i className="bi bi-box-arrow-up-right icon-link"></i>
// //             </div>
// //           </Card.Body>
// //         </Card>
// //         <Card className="alert-card mb-3">
// //           <Card.Body>
// //             <div className="d-flex justify-content-between align-items-center">
// //               <div>
// //                 <h5 className="mb-1">Broken streetlight <span className="badge-high">High</span></h5>
// //                 <p className="mb-0 text-muted">Streetlight is not working, making the area unsafe at night.</p>
// //                 <div className="alert-meta mt-2">
// //                   <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>456 Elm Street, Residential District</span>
// //                   <span><i className="bi bi-clock me-1"></i>615 days ago</span>
// //                 </div>
// //               </div>
// //               <i className="bi bi-box-arrow-up-right icon-link"></i>
// //             </div>
// //           </Card.Body>
// //         </Card>
// //         <button className="btn btn-secondary mt-3">View All Alerts</button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardPage;

// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig"; // Assuming your firebase config is here
// import { Link } from 'react-router-dom';

// const DashboardPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         const fetchReports = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, "reports"));
//                 const reportsData = querySnapshot.docs.map(doc => ({
//                     id: doc.id,
//                     ...doc.data()
//                 }));
//                 setReports(reportsData);
//             } catch (err) {
//                 console.error("Error fetching reports:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchReports();
//     }, []);

//     // Dynamic calculations based on fetched reports
//     const totalIssues = reports.length;
//     const openIssues = reports.filter(r => r.status !== 'resolved').length;
//     const resolvedIssues = reports.filter(r => r.status === 'resolved').length;
//     const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
//     // Placeholder for trend data (requires historical data to be truly dynamic)
//     const lastMonthIssues = 10; // This would be a real calculation
//     const issuesChange = totalIssues - lastMonthIssues;

//     const recentAlerts = reports
//         .filter(r => r.priority === 'High' || r.priority === 'Critical')
//         .sort((a, b) => new Date(b.date) - new Date(a.date))
//         .slice(0, 2);

//     if (loading) {
//         return <div className="p-4 text-center">Loading dashboard data...</div>;
//     }

//     return (
//         <div className="dashboard-page">
//             <h2 className="main-title">Municipal Dashboard</h2>
//             <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
//             <Row className="summary-cards mt-4 g-4">
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Total Issues Reported</span>
//                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                             </div>
//                             <h3 className="card-value">{totalIssues}</h3>
//                             <p className="card-trend text-danger">
//                                 <BsArrowUp /> 12% from last month {/* Placeholder trend */}
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Open Issues</span>
//                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                             </div>
//                             <h3 className="card-value">{openIssues}</h3>
//                             <p className="card-trend text-danger">
//                                 <BsArrowUp /> +1 requires attention {/* Placeholder trend */}
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Resolved Issues</span>
//                                 <i className="bi bi-check-circle-fill icon-success"></i>
//                             </div>
//                             <h3 className="card-value">{resolvedIssues}</h3>
//                             <p className="card-trend text-muted">
//                                 {resolutionRate}% resolution rate
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Avg. Response Time</span>
//                                 <i className="bi bi-clock-fill icon-info"></i>
//                             </div>
//                             <h3 className="card-value">2.9d</h3> {/* This is still a static value */}
//                             <p className="card-trend text-success">
//                                 <BsArrowDown /> -15min from last week {/* Placeholder trend */}
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <div className="recent-alerts mt-5">
//                 <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
//                 {recentAlerts.length > 0 ? (
//                     recentAlerts.map(alert => (
//                         <Card className="alert-card mb-3" key={alert.id}>
//                             <Card.Body>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5 className="mb-1">{alert.type} at {alert.location}
//                                             <span className={`badge-high ms-2`}>{alert.priority}</span>
//                                         </h5>
//                                         <p className="mb-0 text-muted">{alert.description}</p>
//                                         <div className="alert-meta mt-2">
//                                             <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location}</span>
//                                             <span><i className="bi bi-clock me-1"></i>{new Date(alert.date).toLocaleDateString()}</span>
//                                         </div>
//                                     </div>
//                                     <Link to={`/issue/${alert.id}`}><i className="bi bi-box-arrow-up-right icon-link"></i></Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-muted">No critical alerts to display.</p>
//                 )}
//                 <Link to="/issues" className="btn btn-secondary mt-3">View All Alerts</Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import { Link } from 'react-router-dom';

// const DashboardPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     useEffect(() => {
//         // Set up the real-time listener for the 'reports' collection
//         const q = query(collection(db, "reports"));
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const reportsData = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setReports(reportsData);
//             setLoading(false);
//         }, (error) => {
//             console.error("Error fetching real-time reports:", error);
//             setLoading(false);
//         });

//         // Cleanup function to detach the listener when the component unmounts
//         return () => unsubscribe();
//     }, []);

//     // Dynamic calculations based on fetched reports
//     const totalIssues = reports.length;
//     const openIssues = reports.filter(r => r.status !== 'resolved').length;
//     const resolvedIssues = reports.filter(r => r.status === 'resolved').length;
//     const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
//     // NOTE: Trend data (e.g., "12% from last month") requires historical data and a more complex query.
//     // This example uses placeholders for simplicity.
//     const lastMonthIssues = 10; 
//     const issuesChange = totalIssues - lastMonthIssues;

//     const recentAlerts = reports
//         .filter(r => r.priority === 'High' || r.priority === 'Critical')
//         .sort((a, b) => new Date(b.date) - new Date(a.date))
//         .slice(0, 2);

//     if (loading) {
//         return <div className="p-4 text-center">Loading dashboard data...</div>;
//     }

//     return (
//         <div className="dashboard-page">
//             <h2 className="main-title">Municipal Dashboard</h2>
//             <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
//             <Row className="summary-cards mt-4 g-4">
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Total Issues Reported</span>
//                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                             </div>
//                             <h3 className="card-value">{totalIssues}</h3>
//                             <p className="card-trend text-danger">
//                                 <BsArrowUp /> 12% from last month
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Open Issues</span>
//                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                             </div>
//                             <h3 className="card-value">{openIssues}</h3>
//                             <p className="card-trend text-danger">
//                                 <BsArrowUp /> +1 requires attention
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Resolved Issues</span>
//                                 <i className="bi bi-check-circle-fill icon-success"></i>
//                             </div>
//                             <h3 className="card-value">{resolvedIssues}</h3>
//                             <p className="card-trend text-muted">
//                                 {resolutionRate}% resolution rate
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={3}>
//                     <Card className="summary-card">
//                         <Card.Body>
//                             <div className="d-flex align-items-center mb-2">
//                                 <span className="card-title me-2">Avg. Response Time</span>
//                                 <i className="bi bi-clock-fill icon-info"></i>
//                             </div>
//                             <h3 className="card-value">2.9d</h3>
//                             <p className="card-trend text-success">
//                                 <BsArrowDown /> -15min from last week
//                             </p>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>

//             <div className="recent-alerts mt-5">
//                 <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
//                 {recentAlerts.length > 0 ? (
//                     recentAlerts.map(alert => (
//                         <Card className="alert-card mb-3" key={alert.id}>
//                             <Card.Body>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5 className="mb-1">{alert.type} at {alert.location}
//                                             <span className={`badge-high ms-2`}>{alert.priority}</span>
//                                         </h5>
//                                         <p className="mb-0 text-muted">{alert.description}</p>
//                                         <div className="alert-meta mt-2">
//                                             <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location}</span>
//                                             <span><i className="bi bi-clock me-1"></i>{new Date(alert.date).toLocaleDateString()}</span>
//                                         </div>
//                                     </div>
//                                     <Link to={`/issue/${alert.id}`}><i className="bi bi-box-arrow-up-right icon-link"></i></Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-muted">No critical alerts to display.</p>
//                 )}
//                 <Link to="/issues" className="btn btn-secondary mt-3">View All Alerts</Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col } from 'react-bootstrap';
// import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import { Link } from 'react-router-dom';

// const DashboardPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const q = query(collection(db, "reports"));
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const reportsData = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setReports(reportsData);
//             setLoading(false);
//         });
//         return () => unsubscribe();
//     }, []);

//     const totalIssues = reports.length;
//     const openIssues = reports.filter(r => r.status?.toLowerCase() !== 'resolved').length;
//     const resolvedIssues = reports.filter(r => r.status?.toLowerCase() === 'resolved').length;
//     const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
//     const recentAlerts = reports
//         .filter(r => 
//             (r.priority?.toLowerCase() === 'high' || r.priority?.toLowerCase() === 'critical') &&
//             r.status?.toLowerCase() !== 'resolved'
//         )
//         .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0))
//         .slice(0, 3);

//     if (loading) {
//         return <div className="p-4 text-center">Loading dashboard data...</div>;
//     }

//     return (
//         <div className="dashboard-page">
//             <h2 className="main-title">Municipal Dashboard</h2>
//             <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
//             <Row className="summary-cards mt-4 g-4">
//                 <Row className="summary-cards mt-4 g-4">
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Total Issues Reported</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{totalIssues}</h3>
//                              <p className="card-trend text-danger">
//                                  <BsArrowUp /> 12% from last month
//                              </p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Open Issues</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{openIssues}</h3>
//                              <p className="card-trend text-danger">
//                                  <BsArrowUp /> +1 requires attention
//                              </p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Resolved Issues</span>
//                                  <i className="bi bi-check-circle-fill icon-success"></i>
//                              </div>
//                              <h3 className="card-value">{resolvedIssues}</h3>
//                              <p className="card-trend text-muted">
//                                  {resolutionRate}% resolution rate
//                              </p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Avg. Response Time</span>
//                                  <i className="bi bi-clock-fill icon-info"></i>
//                              </div>
//                              <h3 className="card-value">2.9d</h3>
//                              <p className="card-trend text-success">
//                                  <BsArrowDown /> -15min from last week
//                              </p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//              </Row>
//             </Row>

//             <div className="recent-alerts mt-5">
//                 <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
//                 {recentAlerts.length > 0 ? (
//                     recentAlerts.map(alert => (
//                         <Card className="alert-card mb-3" key={alert.id}>
//                             <Card.Body>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5 className="mb-1">{alert.type || 'N/A'}
//                                             <span className={`priority-badge priority-${alert.priority?.toLowerCase()} ms-2`}>{alert.priority || 'N/A'}</span>
//                                         </h5>
                                        
//                                         {/* --- DESCRIPTION ADDED HERE --- */}
//                                         <p className="mb-2 text-muted mt-1 fst-italic">
//                                             {alert.description?.substring(0, 120)}{alert.description?.length > 120 ? '...' : ''}
//                                         </p>

//                                         <div className="alert-meta mt-2 text-muted">
//                                             <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location || 'N/A'}</span>
//                                             <span>
//                                                 <i className="bi bi-clock me-1"></i>
//                                                 { alert.createdAt?.toDate()?.toLocaleDateString() || 'N/A' }
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <Link to={`/issue/${alert.id}`} className="btn btn-sm btn-outline-secondary">View</Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-muted">No unresolved critical alerts to display.</p>
//                 )}
//                 <Link to="/issues" className="btn btn-secondary mt-3">View All Issues</Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;


// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Alert } from 'react-bootstrap';
// import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import { Link } from 'react-router-dom';

// // Helper for Dashboard Hotspot Logic
// const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; 
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// };

// const DashboardPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [hotspotCount, setHotspotCount] = useState(0);

//     useEffect(() => {
//         const q = query(collection(db, "reports"));
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const reportsData = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setReports(reportsData);
            
//             // --- CALCULATE HOTSPOTS FOR DASHBOARD ---
//             let count = 0;
//             // Filter only valid locations & non-resolved issues
//             const activeIssues = reportsData.filter(r => r.location && r.location.includes(',') && r.status !== 'Resolved');
            
//             // Logic: An issue is a hotspot if 2+ neighbors are within 50m
//             // We count UNIQUE hotspots (approximate)
//             const visited = new Set();
//             activeIssues.forEach(issue => {
//                 if(visited.has(issue.id)) return;

//                 const [lat1, lon1] = issue.location.split(',').map(Number);
//                 const neighbors = activeIssues.filter(other => {
//                     if (other.id === issue.id) return false;
//                     const [lat2, lon2] = other.location.split(',').map(Number);
//                     return getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) <= 50;
//                 });

//                 if (neighbors.length >= 2) {
//                     count++;
//                     visited.add(issue.id);
//                     neighbors.forEach(n => visited.add(n.id)); // Mark neighbors as part of this hotspot
//                 }
//             });
//             setHotspotCount(count);
//             setLoading(false);
//         });
//         return () => unsubscribe();
//     }, []);

//     const totalIssues = reports.length;
//     const openIssues = reports.filter(r => r.status?.toLowerCase() !== 'resolved').length;
//     const resolvedIssues = reports.filter(r => r.status?.toLowerCase() === 'resolved').length;
//     const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
//     const recentAlerts = reports
//         .filter(r => 
//             (r.priority?.toLowerCase() === 'high' || r.priority?.toLowerCase() === 'critical') &&
//             r.status?.toLowerCase() !== 'resolved'
//         )
//         .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0))
//         .slice(0, 3);

//     if (loading) {
//         return <div className="p-4 text-center">Loading dashboard data...</div>;
//     }

//     return (
//         <div className="dashboard-page">
//             <h2 className="main-title">Municipal Dashboard</h2>
//             <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
//             {/* 🚨 HOTSPOT ALERT BANNER 🚨 */}
//             {hotspotCount > 0 && (
//                 <Alert variant="danger" className="d-flex align-items-center shadow-sm">
//                     <i className="bi bi-exclamation-octagon-fill fs-3 me-3"></i>
//                     <div>
//                         <h5 className="alert-heading mb-1">Critical Hotspots Detected!</h5>
//                         <p className="mb-0">
//                             There are <strong>{hotspotCount} areas</strong> showing unusually high complaint activity (3+ reports). 
//                             <Link to="/map" className="alert-link ms-2">View on Map</Link>
//                         </p>
//                     </div>
//                 </Alert>
//             )}

//             <Row className="summary-cards mt-4 g-4">
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Total Issues</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{totalIssues}</h3>
//                              <p className="card-trend text-danger"><BsArrowUp /> 12% from last month</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Open Issues</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{openIssues}</h3>
//                              <p className="card-trend text-danger"><BsArrowUp /> Action required</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Resolved</span>
//                                  <i className="bi bi-check-circle-fill icon-success"></i>
//                              </div>
//                              <h3 className="card-value">{resolvedIssues}</h3>
//                              <p className="card-trend text-muted">{resolutionRate}% rate</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Avg. Response</span>
//                                  <i className="bi bi-clock-fill icon-info"></i>
//                              </div>
//                              <h3 className="card-value">2.9d</h3>
//                              <p className="card-trend text-success"><BsArrowDown /> -15min vs last week</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//             </Row>

//             <div className="recent-alerts mt-5">
//                 <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
//                 {recentAlerts.length > 0 ? (
//                     recentAlerts.map(alert => (
//                         <Card className="alert-card mb-3" key={alert.id}>
//                             <Card.Body>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5 className="mb-1">{alert.type || 'N/A'}
//                                             <span className={`priority-badge priority-${alert.priority?.toLowerCase()} ms-2`}>{alert.priority || 'N/A'}</span>
//                                         </h5>
//                                         <p className="mb-2 text-muted mt-1 fst-italic">
//                                             {alert.description?.substring(0, 120)}{alert.description?.length > 120 ? '...' : ''}
//                                         </p>
//                                         <div className="alert-meta mt-2 text-muted">
//                                             <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location || 'N/A'}</span>
//                                             <span>
//                                                 <i className="bi bi-clock me-1"></i>
//                                                 { alert.createdAt?.toDate()?.toLocaleDateString() || 'N/A' }
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <Link to={`/issue/${alert.id}`} className="btn btn-sm btn-outline-secondary">View</Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-muted">No unresolved critical alerts to display.</p>
//                 )}
//                 <Link to="/issues" className="btn btn-secondary mt-3">View All Issues</Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Alert } from 'react-bootstrap';
// import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
// import { collection, query, onSnapshot } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import { Link } from 'react-router-dom';

// const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
//     const R = 6371e3; 
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
// };

// const DashboardPage = () => {
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [hotspotCount, setHotspotCount] = useState(0);

//     useEffect(() => {
//         const q = query(collection(db, "reports"));
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const reportsData = querySnapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data()
//             }));
//             setReports(reportsData);
            
//             // --- HOTSPOT LOGIC (MATCHES MAP PAGE) ---
//             let count = 0;
//             const activeIssues = reportsData.filter(r => r.location && r.location.includes(',') && r.status !== 'Resolved');
//             const visited = new Set();

//             activeIssues.forEach(issue => {
//                 if(visited.has(issue.id)) return;

//                 const [lat1, lon1] = issue.location.split(',').map(Number);
//                 const neighbors = activeIssues.filter(other => {
//                     if (other.id === issue.id) return false;
//                     const [lat2, lon2] = other.location.split(',').map(Number);
//                     // High Sensitivity: 5000 meters
//                     return getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) <= 5000;
//                 });

//                 // High Sensitivity: 2+ total reports triggers it
//                 if (neighbors.length >= 1) {
//                     count++;
//                     visited.add(issue.id);
//                     neighbors.forEach(n => visited.add(n.id));
//                 }
//             });
//             setHotspotCount(count);
//             setLoading(false);
//         });
//         return () => unsubscribe();
//     }, []);

//     const totalIssues = reports.length;
//     const openIssues = reports.filter(r => r.status?.toLowerCase() !== 'resolved').length;
//     const resolvedIssues = reports.filter(r => r.status?.toLowerCase() === 'resolved').length;
//     const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
//     // Sort logic for critical alerts
//     const recentAlerts = reports
//         .filter(r => 
//             (r.priority?.toLowerCase() === 'high' || r.priority?.toLowerCase() === 'critical') &&
//             r.status?.toLowerCase() !== 'resolved'
//         )
//         .sort((a, b) => {
//             // Handle Firestore Timestamps safely
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB - dateA;
//         })
//         .slice(0, 3);

//     if (loading) {
//         return <div className="p-4 text-center">Loading dashboard data...</div>;
//     }

//     return (
//         <div className="dashboard-page">
//             <h2 className="main-title">Municipal Dashboard</h2>
//             <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
//             {/* 🚨 DANGER ALERT BANNER 🚨 */}
//             {hotspotCount > 0 && (
//                 <Alert variant="danger" className="d-flex align-items-center shadow-sm mb-4">
//                     <i className="bi bi-exclamation-octagon-fill fs-3 me-3"></i>
//                     <div>
//                         <h5 className="alert-heading mb-1">Critical Hotspots Detected!</h5>
//                         <p className="mb-0">
//                             We detected <strong>{hotspotCount} clusters</strong> where multiple citizens (2+) have reported issues within 5km.
//                             <Link to="/map" className="alert-link ms-2 fw-bold">View on Map</Link>
//                         </p>
//                     </div>
//                 </Alert>
//             )}

//             <Row className="summary-cards mt-2 g-4">
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Total Issues</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{totalIssues}</h3>
//                              <p className="card-trend text-danger"><BsArrowUp /> 12% from last month</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Open Issues</span>
//                                  <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
//                              </div>
//                              <h3 className="card-value">{openIssues}</h3>
//                              <p className="card-trend text-danger"><BsArrowUp /> Action required</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Resolved</span>
//                                  <i className="bi bi-check-circle-fill icon-success"></i>
//                              </div>
//                              <h3 className="card-value">{resolvedIssues}</h3>
//                              <p className="card-trend text-muted">{resolutionRate}% rate</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//                  <Col md={3}>
//                      <Card className="summary-card">
//                          <Card.Body>
//                              <div className="d-flex align-items-center mb-2">
//                                  <span className="card-title me-2">Avg. Response</span>
//                                  <i className="bi bi-clock-fill icon-info"></i>
//                              </div>
//                              <h3 className="card-value">2.9d</h3>
//                              <p className="card-trend text-success"><BsArrowDown /> -15min vs last week</p>
//                          </Card.Body>
//                      </Card>
//                  </Col>
//             </Row>

//             <div className="recent-alerts mt-5">
//                 <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
//                 {recentAlerts.length > 0 ? (
//                     recentAlerts.map(alert => (
//                         <Card className="alert-card mb-3" key={alert.id}>
//                             <Card.Body>
//                                 <div className="d-flex justify-content-between align-items-center">
//                                     <div>
//                                         <h5 className="mb-1">{alert.type || 'N/A'}
//                                             <span className={`priority-badge priority-${alert.priority?.toLowerCase()} ms-2`}>{alert.priority || 'N/A'}</span>
//                                         </h5>
//                                         <p className="mb-2 text-muted mt-1 fst-italic">
//                                             {alert.description?.substring(0, 120)}{alert.description?.length > 120 ? '...' : ''}
//                                         </p>
//                                         <div className="alert-meta mt-2 text-muted">
//                                             <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location || 'N/A'}</span>
//                                             <span>
//                                                 <i className="bi bi-clock me-1"></i>
//                                                 { alert.createdAt?.toDate ? alert.createdAt.toDate().toLocaleDateString() : 'N/A' }
//                                             </span>
//                                         </div>
//                                     </div>
//                                     <Link to={`/issue/${alert.id}`} className="btn btn-sm btn-outline-secondary">View</Link>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-muted">No unresolved critical alerts to display.</p>
//                 )}
//                 <Link to="/issues" className="btn btn-secondary mt-3">View All Issues</Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import { Link } from 'react-router-dom';

// Distance Helper
const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const DashboardPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotspotCount, setHotspotCount] = useState(0);

    useEffect(() => {
        console.log("🔄 Dashboard: Fetching Data...");
        
        const q = query(collection(db, "reports"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reportsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            
            // --- HOTSPOT CALCULATION (DEBUG MODE) ---
            let count = 0;
            // Filter: Must have location, comma, and NOT be resolved (case-insensitive)
            const activeIssues = reportsData.filter(r => 
                r.location && 
                r.location.includes(',') && 
                r.status?.toLowerCase() !== 'resolved'
            );

            console.log(`📊 Analysis: Checking ${activeIssues.length} active issues for hotspots...`);

            const visited = new Set();

            activeIssues.forEach(issue => {
                if(visited.has(issue.id)) return;

                const [lat1, lon1] = issue.location.split(',').map(Number);
                
                const neighbors = activeIssues.filter(other => {
                    if (other.id === issue.id) return false;
                    const [lat2, lon2] = other.location.split(',').map(Number);
                    
                    const dist = getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
                    // DEBUG: Print distance between items
                    // console.log(`📏 Dist: ${dist.toFixed(0)}m between ${issue.type} & ${other.type}`);
                    
                    return dist <= 5000; // 5000 meters (Same as Map)
                });

                // If at least 1 neighbor is found (Cluster of 2+)
                if (neighbors.length >= 1) {
                    console.log(`🔥 HOTSPOT FOUND: ${issue.type} has ${neighbors.length} neighbors.`);
                    count++;
                    visited.add(issue.id);
                    neighbors.forEach(n => visited.add(n.id));
                }
            });

            console.log(`✅ Final Hotspot Count: ${count}`);
            setHotspotCount(count);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const totalIssues = reports.length;
    const openIssues = reports.filter(r => r.status?.toLowerCase() !== 'resolved').length;
    const resolvedIssues = reports.filter(r => r.status?.toLowerCase() === 'resolved').length;
    const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(0) : 0;
    
    const recentAlerts = reports
        .filter(r => 
            (r.priority?.toLowerCase() === 'high' || r.priority?.toLowerCase() === 'critical') &&
            r.status?.toLowerCase() !== 'resolved'
        )
        .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 3);

    if (loading) {
        return <div className="p-4 text-center">Loading dashboard data...</div>;
    }

    return (
        <div className="dashboard-page">
            <h2 className="main-title">Municipal Dashboard</h2>
            <p className="subtitle">Manage and track citizen complaints and issues across the city</p>
            
            {/* 🚨 CRITICAL ALERT SECTION 🚨 */}
            {hotspotCount > 0 ? (
                <Alert variant="danger" className="d-flex align-items-center shadow-sm mb-4 border-danger">
                    <div className="bg-danger text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{width:'50px', height:'50px'}}>
                        <i className="bi bi-exclamation-triangle-fill fs-4"></i>
                    </div>
                    <div>
                        <h4 className="alert-heading mb-1 text-danger fw-bold">Critical Hotspots Detected!</h4>
                        <p className="mb-0 text-dark">
                            <strong>{hotspotCount} areas</strong> have high report density (2+ issues within 5km). 
                            <Link to="/map" className="btn btn-sm btn-danger ms-3">View Live Map &rarr;</Link>
                        </p>
                    </div>
                </Alert>
            ) : (
                // OPTIONAL: Show a green alert if safe, just to prove logic is running
                <Alert variant="success" className="mb-4">
                    <i className="bi bi-shield-check me-2"></i> No critical hotspots detected at this time.
                </Alert>
            )}

            <Row className="summary-cards mt-2 g-4">
                 <Col md={3}>
                     <Card className="summary-card">
                         <Card.Body>
                             <div className="d-flex align-items-center mb-2">
                                 <span className="card-title me-2">Total Issues</span>
                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
                             </div>
                             <h3 className="card-value">{totalIssues}</h3>
                             <p className="card-trend text-danger"><BsArrowUp /> 12% from last month</p>
                         </Card.Body>
                     </Card>
                 </Col>
                 <Col md={3}>
                     <Card className="summary-card">
                         <Card.Body>
                             <div className="d-flex align-items-center mb-2">
                                 <span className="card-title me-2">Open Issues</span>
                                 <i className="bi bi-exclamation-triangle-fill icon-danger"></i>
                             </div>
                             <h3 className="card-value">{openIssues}</h3>
                             <p className="card-trend text-danger"><BsArrowUp /> Action required</p>
                         </Card.Body>
                     </Card>
                 </Col>
                 <Col md={3}>
                     <Card className="summary-card">
                         <Card.Body>
                             <div className="d-flex align-items-center mb-2">
                                 <span className="card-title me-2">Resolved</span>
                                 <i className="bi bi-check-circle-fill icon-success"></i>
                             </div>
                             <h3 className="card-value">{resolvedIssues}</h3>
                             <p className="card-trend text-muted">{resolutionRate}% rate</p>
                         </Card.Body>
                     </Card>
                 </Col>
                 <Col md={3}>
                     <Card className="summary-card">
                         <Card.Body>
                             <div className="d-flex align-items-center mb-2">
                                 <span className="card-title me-2">Avg. Response</span>
                                 <i className="bi bi-clock-fill icon-info"></i>
                             </div>
                             <h3 className="card-value">2.9d</h3>
                             <p className="card-trend text-success"><BsArrowDown /> -15min vs last week</p>
                         </Card.Body>
                     </Card>
                 </Col>
            </Row>

            <div className="recent-alerts mt-5">
                <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Recent Critical Alerts</h4>
                {recentAlerts.length > 0 ? (
                    recentAlerts.map(alert => (
                        <Card className="alert-card mb-3" key={alert.id}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{alert.type || 'N/A'}
                                            <span className={`priority-badge priority-${alert.priority?.toLowerCase()} ms-2`}>{alert.priority || 'N/A'}</span>
                                        </h5>
                                        <p className="mb-2 text-muted mt-1 fst-italic">
                                            {alert.description?.substring(0, 120)}{alert.description?.length > 120 ? '...' : ''}
                                        </p>
                                        <div className="alert-meta mt-2 text-muted">
                                            <span className="me-3"><i className="bi bi-geo-alt-fill me-1"></i>{alert.location || 'N/A'}</span>
                                            <span>
                                                <i className="bi bi-clock me-1"></i>
                                                { alert.createdAt?.toDate ? alert.createdAt.toDate().toLocaleDateString() : 'N/A' }
                                            </span>
                                        </div>
                                    </div>
                                    <Link to={`/issue/${alert.id}`} className="btn btn-sm btn-outline-secondary">View</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted">No unresolved critical alerts to display.</p>
                )}
                <Link to="/issues" className="btn btn-secondary mt-3">View All Issues</Link>
            </div>
        </div>
    );
};

export default DashboardPage;
