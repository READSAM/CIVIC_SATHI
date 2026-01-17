import React, {useState,useEffect} from 'react';
import {Card,Row,Col,Alert} from 'react-bootstrap';
import {BsArrowUp,BsArrowDown} from 'react-icons/bs';
import {collection,query,onSnapshot} from "firebase/firestore";
import {db} from "../lib/firebaseconfig";
import {Link} from 'react-router-dom';

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
        console.log("Dashboard: Fetching Data...");
        
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

            console.log(`Analysis: Checking ${activeIssues.length} active issues for hotspots...`);

            const visited = new Set();

            activeIssues.forEach(issue => {
                if(visited.has(issue.id)) return;

                const [lat1, lon1] = issue.location.split(',').map(Number);
                
                const neighbors = activeIssues.filter(other => {
                    if (other.id === issue.id) return false;
                    const [lat2, lon2] = other.location.split(',').map(Number);
                    
                    const dist = getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
                    
                    return dist <= 5000; 
                });

                // If at least 1 neighbor is found
                if (neighbors.length >= 1) {
                    console.log(`HOTSPOT FOUND: ${issue.type} has ${neighbors.length} neighbors.`);
                    count++;
                    visited.add(issue.id);
                    neighbors.forEach(n => visited.add(n.id));
                }
            });

            console.log('Final Hotspot Count: ${count}`);
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
