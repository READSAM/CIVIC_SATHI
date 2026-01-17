import React, {useState,useEffect} from 'react';
import {useParams,Link} from 'react-router-dom';
import {Card,Row,Col,Button,Form,Badge,Alert} from 'react-bootstrap';
import { FaDownload, FaCheckCircle, FaFlag, FaRobot, FaRoad, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import { departments } from '../lib/departments';
import emailjs from '@emailjs/browser';

import { getTrafficProfile } from '../lib/trafficOracle';
import { analyzeIssueContext } from '../lib/intelligence';

const IssueDetailsPage = () => {
    const { id } = useParams();
    
    // Core Data State
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Editable State
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    
    // Validation State
    const [verificationScore, setVerificationScore] = useState(0);
    const [flagCount, setFlagCount] = useState(0);

    //AI & Context State
    const [trafficData, setTrafficData] = useState(null);
    const [aiInsights, setAiInsights] = useState([]);

    const fetchIssueDetails = async () => {
        if (!id) {
            setLoading(false);
            return;
        }
        try {
            const docRef = doc(db, "reports", id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const issueData = docSnap.data();
                
                let formattedDate = 'N/A';
                if (issueData.createdAt && typeof issueData.createdAt.toDate === 'function') {
                    formattedDate = issueData.createdAt.toDate().toLocaleString();
                } else if (issueData.createdAt) {
                    formattedDate = issueData.createdAt.toString();
                }
                
                setIssue({ ...issueData, createdAtFormatted: formattedDate });
                setStatus(issueData.status || 'pending');
                setPriority(issueData.priority || 'Medium');
                setVerificationScore(issueData.verificationScore || 0);
                setFlagCount(issueData.flagCount || 0);

                if (issueData.location) {
                    // Traffic Logic
                    const roadRelatedTypes = ['Pothole', 'Streetlight', 'Accident', 'Road', 'Traffic'];
                    const isRoadIssue = roadRelatedTypes.some(t => 
                        issueData.type && issueData.type.toLowerCase().includes(t.toLowerCase())
                    );

                    if (isRoadIssue) {
                        const trafficInfo = getTrafficProfile(issueData.location);
                        setTrafficData(trafficInfo);
                    } else {
                        setTrafficData(null);
                    }

                    //Context Logic
                    analyzeIssueContext(issueData).then(insights => {
                        setAiInsights(insights);
                    });
                }

            } else {
                setIssue(null);
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssueDetails();
    }, [id]);

    const getSuggestedPriority = () => {
        if (!issue) return null;

        if (trafficData && (trafficData.level === 'CRITICAL' || trafficData.level === 'HIGH')) {
            return { level: 'Critical', reason: 'Heavy Traffic detected' };
        }
            
        if (['Pothole', 'Accident', 'Streetlight'].includes(issue.type)) {
            return { level: 'High', reason: 'Safety Hazard' };
        }

        const hasDisasterAlert = aiInsights.some(insight => insight.type === 'Disaster');
        if (hasDisasterAlert) {
            return { level: 'Critical', reason: 'Monsoon Protocol' };
        }

        return null;
    };

    const suggestion = getSuggestedPriority();

    const handleFlagAsFake = async () => {
        if(!window.confirm("Are you sure you want to flag this report as FAKE?")) return;
        try {
            const docRef = doc(db, "reports", id);
            await updateDoc(docRef, { flagCount: increment(1) });
            const newCount = flagCount + 1;
            setFlagCount(newCount);
            if (newCount >= 3) {
                await updateDoc(docRef, { status: "Spam", priority: "Low" });
                setStatus("Spam");
                setPriority("Low");
                alert("⚠️ System Alert: This report has been auto-moderated as SPAM.");
            } else {
                alert("Report flagged.");
            }
        } catch (e) { console.error(e); }
    };

    const handleVerify = async () => {
        try {
            const docRef = doc(db, "reports", id);
            await updateDoc(docRef, { verificationScore: increment(1) });
            setVerificationScore(verificationScore + 1);
            alert("Verification recorded!");
        } catch (e) { console.error(e); }
    };

    const handleUpdate = async () => {
        if (!id) return;
        const docRef = doc(db, "reports", id);
        try {
            await updateDoc(docRef, { status, priority });
            if (status === "Resolved") {
                const emailParams = {
                    user_name: "Citizen",
                    user_email: issue.userEmail,
                    issue_desc: issue.description,
                    issue_id: id,
                    issue_type: issue.type,
                    resolution_date: new Date().toLocaleDateString()
                };
                try {
                    await emailjs.send("service_1fioyb8", "template_xjfj6ho", emailParams, "Kx-_Am2x6azE2uewb");
                    alert('Updated & Email Sent! ✅');
                } catch (err) {
                    console.error(err);
                    alert('Updated, but Email Failed.');
                }
            } else {
                alert('Issue updated successfully!');
            }
            fetchIssueDetails();
        } catch (error) {
            console.error("Error updating:", error);
            alert('Update failed.');
        }
    };

    if (loading) return <div className="p-4 text-center">Loading details...</div>;
    if (!issue) return <div className="p-4 text-center">Issue not found.</div>;

    const getLocationCoords = () => {
        if (!issue.location || typeof issue.location !== 'string') return null;
        const coords = issue.location.split(',').map(c => parseFloat(c.trim()));
        return (coords.length === 2 && !isNaN(coords[0])) ? coords : null;
    };
    const locationCoords = getLocationCoords();

    const assignedDeptInfo = departments.find(dept => dept.name === issue.assignedDepartment);
    const departmentEmail = assignedDeptInfo ? assignedDeptInfo.email : null;
    let gmailLink = '';
    if (departmentEmail) {
        const subject = `Regarding Issue ID: ${id} - ${issue.type}`;
        const body = `Review Request:\nID: ${id}\nType: ${issue.type}\nLocation: ${issue.location}\n\nDesc:\n${issue.description}`;
        gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(departmentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    return (
        <div className="issue-details-page p-4">
            <Link to="/issues" className="back-link mb-3 d-inline-block text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i> Back to Issues
            </Link>
            
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h2 className="issue-id text-dark mb-0">{id}</h2>
                    <span className="badge bg-secondary me-2">{issue.type}</span>
                    <span className={`badge bg-${status === 'Resolved' ? 'success' : status === 'Spam' ? 'danger' : 'warning'} text-dark border`}>
                        {status}
                    </span>
                </div>
                <div className="text-end">
                    <Badge bg="success" className="me-2 p-2"><FaCheckCircle className="me-1"/> Verified: {verificationScore}</Badge>
                    <Badge bg="danger" className="p-2"><FaFlag className="me-1"/> Flags: {flagCount}</Badge>
                </div>
            </div>

            {flagCount >= 3 && (
                <Alert variant="danger" className="mb-4">
                    <FaFlag className="me-2"/> <strong>Community Alert:</strong> This report has been flagged as spam.
                </Alert>
            )}

            <Row className="g-4">
                <Col md={8}>
                    {/* 🚦 TRAFFIC CARD */}
                    {trafficData && (
                        <div className={`alert alert-${trafficData.color === 'danger' ? 'danger' : 'light'} border shadow-sm mb-4`}>
                            <div className="d-flex align-items-start">
                                <div className={`bg-${trafficData.color} text-white rounded p-3 me-3`}>
                                    <FaRoad className="fs-3"/>
                                </div>
                                <div>
                                    <h5 className={`alert-heading fw-bold text-${trafficData.color} mb-1`}>{trafficData.label}</h5>
                                    <p className="mb-0 text-muted small">{trafficData.description}</p>
                                    {trafficData.roadName && (
                                        <div className="mt-2 fw-bold text-dark small">
                                            <i className="bi bi-geo-alt me-1"></i> {trafficData.roadName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {aiInsights.length > 0 && (
                        <Card className="mb-4 shadow-sm border-0" style={{background: 'linear-gradient(to right, #f8f9fa, #e9ecef)'}}>
                            <Card.Body>
                                <h6 className="mb-3 text-primary fw-bold"><FaRobot className="me-2"/>Smart Context Analysis</h6>
                                {aiInsights.map((insight, idx) => (
                                    <Alert key={idx} variant={insight.color} className="d-flex align-items-center py-2 px-3 mb-2">
                                        <span className="fs-4 me-3">{insight.icon || <FaExclamationTriangle/>}</span>
                                        <div>
                                            <strong className="d-block">{insight.title}</strong>
                                            <span className="small">{insight.message}</span>
                                        </div>
                                    </Alert>
                                ))}
                            </Card.Body>
                        </Card>
                    )}

                    <Card className="detail-card mb-4 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3 border-bottom pb-2">Complaint Details</h5>
                            <div className="mb-3">
                                <h6 className="text-muted small text-uppercase fw-bold">Description</h6>
                                <p className="detail-text">{issue.description || 'N/A'}</p>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <h6 className="text-muted small text-uppercase fw-bold">Location</h6>
                                        <p className="mb-1"><i className="bi bi-geo-alt-fill me-1"></i> {issue.location || 'N/A'}</p>
                                        {locationCoords && (
                                            <Link to="/map" state={{ center: locationCoords }} className="small fw-bold text-primary text-decoration-none">
                                                View on Map &rarr;
                                            </Link>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <h6 className="text-muted small text-uppercase fw-bold">Reported On</h6>
                                        <p className="mb-0"><i className="bi bi-clock-fill me-1"></i> {issue.createdAtFormatted}</p>
                                    </div>
                                </Col>
                            </Row>
                            {issue.tags && (
                                <div className="mb-3">
                                    <h6 className="text-muted small text-uppercase fw-bold">Tags</h6>
                                    <div>
                                        {issue.tags.split(',').map((tag, index) => (
                                            <span key={index} className="badge bg-light text-dark border me-1">{tag.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <hr className="my-3"/>
                            <div className="d-flex align-items-center">
                                <span className="small text-muted me-3">Is this report accurate?</span>
                                <Button variant="outline-success" size="sm" className="me-2" onClick={handleVerify}>
                                    <FaCheckCircle className="me-1"/> I see this too
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={handleFlagAsFake}>
                                    <FaFlag className="me-1"/> Flag as Fake
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="detail-card mb-4 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3 border-bottom pb-2">Media Evidence</h5>
                            {issue.image ? (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small text-muted"><i className="bi bi-image me-1"></i> Attached Photo</span>
                                        <a href={issue.image} download target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border"><FaDownload/> Download</a>
                                    </div>
                                    <img src={issue.image} alt="Evidence" className="img-fluid rounded border" style={{maxHeight:'400px', objectFit:'cover'}} />
                                </div>
                            ) : <p className="text-muted small">No visual evidence provided.</p>}
                            {issue.audio && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="small text-muted"><i className="bi bi-mic-fill me-1"></i> Audio Clip</span>
                                        <a href={issue.audio} download target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light border"><FaDownload/></a>
                                    </div>
                                    <audio controls className="w-100"><source src={issue.audio} type="audio/webm" /></audio>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                {/*sidebar*/}
                <Col md={4}>
                    <div className="sticky-top" style={{top: '20px'}}>
                        <Card className="sidebar-card mb-3 shadow-sm border-secondary">
                            <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#6c757d' }}>
                                Admin Actions
                            </Card.Header>
                            <Card.Body>
                                
                                {/* 💡 AI PRIORITY SUGGESTION (Only shows if priority is different) */}
                                {suggestion && priority !== suggestion.level && (
                                    <Alert variant="info" className="mb-3 small border-info">
                                        <div className="d-flex align-items-start">
                                            <FaLightbulb className="me-2 mt-1 text-primary"/>
                                            <div>
                                                <strong>AI Suggestion:</strong><br/>
                                                Mark as <b>{suggestion.level}</b> due to {suggestion.reason}.
                                                <div className="mt-2">
                                                    <Button size="sm" variant="outline-primary" className="py-0 px-2" onClick={() => setPriority(suggestion.level)}>
                                                        Apply Suggestion
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Alert>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Status</Form.Label>
                                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved (Triggers Email)</option>
                                        <option value="Spam">Mark as Spam</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Priority</Form.Label>
                                    <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="primary" className="w-100 fw-bold" onClick={handleUpdate}>
                                    Update Ticket
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="sidebar-card shadow-sm">
                            <Card.Body>
                                <h6 className="fw-bold mb-2">Assigned Department</h6>
                                <div className="p-2 bg-light rounded mb-3 border">
                                    <i className="bi bi-building me-2 text-primary"></i>
                                    {issue.assignedDepartment || 'Unassigned'}
                                </div>
                                {departmentEmail && (
                                    <Button as="a" href={gmailLink} target="_blank" variant="outline-dark" size="sm" className="w-100">
                                        <i className="bi bi-envelope-plus me-2"></i> Compose Email
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default IssueDetailsPage;
