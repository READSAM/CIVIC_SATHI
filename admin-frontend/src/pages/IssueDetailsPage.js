// // import React, { useState, useEffect } from 'react';
// // import { useParams, Link } from 'react-router-dom';
// // import { Card, Row, Col, Button, Form } from 'react-bootstrap';
// // import { FaDownload } from 'react-icons/fa';
// // import { doc, getDoc, updateDoc } from "firebase/firestore";
// // import { db } from "../lib/firebaseconfig";
// // import { departments } from '../lib/departments';
// // import emailjs from '@emailjs/browser';

// // const IssueDetailsPage = () => {
// //     const { id } = useParams();
// //     const [issue, setIssue] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [status, setStatus] = useState('');
// //     const [priority, setPriority] = useState('');

// //     const fetchIssueDetails = async () => {
// //         if (!id) {
// //             setLoading(false);
// //             return;
// //         }
// //         try {
// //             const docRef = doc(db, "reports", id);
// //             const docSnap = await getDoc(docRef);
// //             if (docSnap.exists()) {
// //                 const issueData = docSnap.data();
// //                 if (issueData.createdAt && typeof issueData.createdAt.toDate === 'function') {
// //                     issueData.createdAt = issueData.createdAt.toDate().toLocaleString();
// //                 }
// //                 setIssue(issueData);
// //                 setStatus(issueData.status || 'pending');
// //                 setPriority(issueData.priority || 'Medium');
// //             } else {
// //                 setIssue(null);
// //             }
// //         } catch (error) {
// //             console.error("Error fetching document:", error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchIssueDetails();
// //     }, [id]);

// //     // const handleUpdate = async () => {
// //     //     if (!id) return;
// //     //     const docRef = doc(db, "reports", id);
// //     //     try {
// //     //         await updateDoc(docRef, {
// //     //             status: status,
// //     //             priority: priority
// //     //         });
// //     //         fetchIssueDetails(); 
// //     //         alert('Issue updated successfully!');
// //     //     } catch (error) {
// //     //         console.error("Error updating document: ", error);
// //     //         alert('Failed to update issue.');
// //     //     }
// //     // };

// //   const handleUpdate = async () => {
// //         if (!id) return;

// //         // 1. Update Firestore first (Your existing logic)
// //         const docRef = doc(db, "reports", id); // Confirmed collection is 'reports'
// //         try {
// //             await updateDoc(docRef, {
// //                 status: status,
// //                 priority: priority
// //             });

// //             // 2. CHECK: Did we just mark it as Resolved?
// //             if (status === "Resolved") {
// //                 console.log("Status is Resolved. Attempting to send email...");

// //                 // Prepare the email parameters
// //                 const emailParams = {
// //                     // We use "Citizen" because 'userName' is missing in your DB screenshot
// //                     user_name: "Citizen", 
// //                     user_email: issue.userEmail, // Confirmed field name from your screenshot
// //                     issue_desc: issue.description,
// //                     issue_id: id,
// //                     issue_type: issue.type,
// //                     resolution_date: new Date().toLocaleDateString()
// //                 };

// //                 // Send the email
// //                 try {
// //                     await emailjs.send(
// //                         "service_1fioyb8",     // <-- Paste your Service ID
// //                         "template_xjfj6ho",    // <-- Paste your Template ID
// //                         emailParams,
// //                         "Kx-_Am2x6azE2uewb"      // <-- Paste your Public Key
// //                     );
// //                     alert('Issue updated & Resolution Email sent to user! ✅');
// //                 } catch (emailError) {
// //                     console.error("Firebase updated, but Email failed:", emailError);
// //                     alert('Issue updated, but failed to send email. Check console for errors.');
// //                 }
// //             } else {
// //                 // If status is NOT 'Resolved', just show success message
// //                 alert('Issue updated successfully!');
// //             }

// //             fetchIssueDetails(); 
// //         } catch (error) {
// //             console.error("Error updating document: ", error);
// //             alert('Failed to update issue.');
// //         }
// //     };

// //     if (loading) {
// //         return <div className="p-4 text-center">Loading issue details...</div>;
// //     }

// //     if (!issue) {
// //         return <div className="p-4 text-center">Issue not found.</div>;
// //     }

// //     const getLocationCoords = () => {
// //         if (!issue.location || typeof issue.location !== 'string') return null;
// //         const coords = issue.location.split(',').map(c => parseFloat(c.trim()));
// //         if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
// //             return coords;
// //         }
// //         return null;
// //     };
// //     const locationCoords = getLocationCoords();

// //     const assignedDeptInfo = departments.find(dept => dept.name === issue.assignedDepartment);
// //     const departmentEmail = assignedDeptInfo ? assignedDeptInfo.email : null;

// //     let gmailLink = '';
// //     if (departmentEmail) {
// //         const subject = `Regarding Issue ID: ${id} - ${issue.type}`;
        
// //         // Conditionally add the image link to the body text
// //         const imageLinkText = issue.image 
// //             ? `\n- View Attached Image: ${issue.image}` 
// //             : '';

// //         const body = `
// // Dear ${issue.assignedDepartment},

// // Please review the following reported issue:

// // - Issue ID: ${id}
// // - Type: ${issue.type || 'N/A'}
// // - Location: ${issue.location || 'N/A'}
// // - Reported On: ${issue.createdAt || 'N/A'}
// // - Priority: ${priority} 
// // - Status: ${status}${imageLinkText}

// // Description:
// // ${issue.description || 'N/A'}

// // Thank you.
// //         `;
// //         const gmailBaseUrl = "https://mail.google.com/mail/?view=cm&fs=1";
// //         gmailLink = `${gmailBaseUrl}&to=${encodeURIComponent(departmentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
// //     }

// //     return (
// //         <div className="issue-details-page p-4">
// //             <Link to="/issues" className="back-link mb-3 d-inline-block">
// //                 <i className="bi bi-arrow-left me-2"></i> Back to Issues
// //             </Link>
// //             <h2 className="issue-id">{id}</h2>
// //             <p className="issue-title">{issue.type || 'N/A'}</p>

// //             <Row className="mt-4 g-4">
// //                 <Col md={8}>
// //                     <Card className="detail-card mb-4">
// //                         <Card.Body>
// //                             <h5>Complaint Details</h5>
// //                             <div className="mb-3">
// //                                 <h6 className="detail-label">Description</h6>
// //                                 <p className="detail-text">{issue.description || 'N/A'}</p>
// //                             </div>
                            
// //                             {issue.tags && (
// //                                 <div className="mb-3">
// //                                     <h6 className="detail-label">Tags</h6>
// //                                     <div className="d-flex flex-wrap">
// //                                         {issue.tags.split(',').map((tag, index) => (
// //                                             <span key={index} className="badge-tag me-2 mb-2">
// //                                                 {tag.trim()}
// //                                             </span>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}

// //                             <div className="mb-3">
// //                                 <h6 className="detail-label">Location</h6>
// //                                 <p className="mb-1"><i className="bi bi-geo-alt-fill me-1"></i> {issue.location || 'N/A'}</p>
// //                                 {locationCoords && (
// //                                     <Link to="/map" state={{ center: locationCoords }} className="fw-bold">
// //                                         View on Map
// //                                     </Link>
// //                                 )}
// //                             </div>
// //                             <div className="mb-3">
// //                                 <h6 className="detail-label">Reported On</h6>
// //                                 <p className="mb-0"><i className="bi bi-clock-fill me-1"></i> {issue.createdAt || 'N/A'}</p>
// //                             </div>
// //                         </Card.Body>
// //                     </Card>

// //                     <Card className="detail-card mb-4">
// //                         <Card.Body>
// //                             <h5><i className="bi bi-paperclip me-2"></i>Media & Evidence</h5>
// //                             {issue.image && (
// //                                 <div className="media-container mb-3">
// //                                     <div className="media-header d-flex justify-content-between align-items-center mb-2">
// //                                         <span className="media-type"><i className="bi bi-image-fill me-1"></i> Photo</span>
// //                                         <a href={issue.image} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
// //                                     </div>
// //                                     <img src={issue.image} alt="Issue evidence" className="img-fluid rounded border" />
// //                                 </div>
// //                             )}
// //                             {issue.audio && (
// //                                 <div className="media-container mt-4">
// //                                     <div className="media-header d-flex justify-content-between align-items-center mb-2">
// //                                         <span className="media-type"><i className="bi bi-mic-fill me-1"></i> Audio</span>
// //                                         <a href={issue.audio} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
// //                                     </div>
// //                                     <audio controls className="w-100">
// //                                         <source src={issue.audio} type="audio/webm" />
// //                                         Your browser does not support the audio element.
// //                                     </audio>
// //                                 </div>
// //                             )}
// //                             {!issue.image && !issue.audio && (
// //                                 <p className="text-muted">No media was provided for this issue.</p>
// //                             )}
// //                         </Card.Body>
// //                     </Card>
// //                 </Col>
// //                 <Col md={4}>
// //                     <div className="right-sidebar">
// //                         <Card className="sidebar-card status-card mb-4">
// //                             <Card.Body>
// //                                 <h5>Status & Priority</h5>
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label>Update Status</Form.Label>
// //                                     <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
// //                                         <option value="pending">Pending</option>
// //                                         <option value="Assigned">Assigned</option>
// //                                         <option value="In Progress">In Progress</option>
// //                                         <option value="Resolved">Resolved</option>
// //                                     </Form.Select>
// //                                 </Form.Group>
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label>Update Priority</Form.Label>
// //                                     <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
// //                                         <option value="Low">Low</option>
// //                                         <option value="Medium">Medium</option>
// //                                         <option value="High">High</option>
// //                                         <option value="Critical">Critical</option>
// //                                     </Form.Select>
// //                                 </Form.Group>
// //                             </Card.Body>
// //                         </Card>

// //                         <Card className="sidebar-card mb-4">
// //                             <Card.Body>
// //                                 <h5>Assigned Department</h5>
// //                                 <p className="fw-bold mb-2">
// //                                     <i className="bi bi-building-fill me-2"></i>
// //                                     {issue.assignedDepartment || 'Unassigned'}
// //                                 </p>
// //                                 {departmentEmail && (
// //                                     <Button 
// //                                         as="a" 
// //                                         href={gmailLink} 
// //                                         target="_blank" 
// //                                         rel="noopener noreferrer"
// //                                         variant="outline-primary" 
// //                                         className="w-100 mt-2"
// //                                     >
// //                                         <i className="bi bi-envelope-fill me-2"></i>
// //                                         Draft Email in Gmail
// //                                     </Button>
// //                                 )}
// //                             </Card.Body>
// //                         </Card>
                        
// //                         <Button variant="primary" className="w-100" onClick={handleUpdate}>
// //                             Save Changes
// //                         </Button>
// //                     </div>
// //                 </Col>
// //             </Row>
// //         </div>
// //     );
// // };

// // export default IssueDetailsPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Card, Row, Col, Button, Form } from 'react-bootstrap';
// import { FaDownload } from 'react-icons/fa';
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../lib/firebaseconfig";
// import { departments } from '../lib/departments';
// import emailjs from '@emailjs/browser';

// const IssueDetailsPage = () => {
//     const { id } = useParams();
//     const [issue, setIssue] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [status, setStatus] = useState('');
//     const [priority, setPriority] = useState('');

//     const fetchIssueDetails = async () => {
//         if (!id) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const docRef = doc(db, "reports", id);
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 const issueData = docSnap.data();
//                 if (issueData.createdAt && typeof issueData.createdAt.toDate === 'function') {
//                     issueData.createdAt = issueData.createdAt.toDate().toLocaleString();
//                 }
//                 setIssue(issueData);
//                 setStatus(issueData.status || 'pending');
//                 setPriority(issueData.priority || 'Medium');
//             } else {
//                 setIssue(null);
//             }
//         } catch (error) {
//             console.error("Error fetching document:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchIssueDetails();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id]);

//     const handleUpdate = async () => {
//         if (!id) return;

//         // 1. Update Firestore first (Your existing logic)
//         const docRef = doc(db, "reports", id); // Confirmed collection is 'reports'
//         try {
//             await updateDoc(docRef, {
//                 status: status,
//                 priority: priority
//             });

//             // 2. CHECK: Did we just mark it as Resolved?
//             if (status === "Resolved") {
//                 console.log("Status is Resolved. Attempting to send email...");

//                 // Prepare the email parameters
//                 const emailParams = {
//                     // We use "Citizen" because 'userName' is missing in your DB screenshot
//                     user_name: "Citizen", 
//                     user_email: issue.userEmail, // Confirmed field name from your screenshot
//                     issue_desc: issue.description,
//                     issue_id: id,
//                     issue_type: issue.type,
//                     resolution_date: new Date().toLocaleDateString()
//                 };

//                 // Send the email
//                 try {
//                     await emailjs.send(
//                         "service_1fioyb8",      // Your Service ID
//                         "template_xjfj6ho",     // Your Template ID
//                         emailParams,
//                         "Kx-_Am2x6azE2uewb"       // Your Public Key
//                     );
//                     alert('Issue updated & Resolution Email sent to user! ✅');
//                 } catch (emailError) {
//                     console.error("Firebase updated, but Email failed:", emailError);
//                     alert('Issue updated, but failed to send email. Check console for errors.');
//                 }
//             } else {
//                 // If status is NOT 'Resolved', just show success message
//                 alert('Issue updated successfully!');
//             }

//             fetchIssueDetails(); 
//         } catch (error) {
//             console.error("Error updating document: ", error);
//             alert('Failed to update issue.');
//         }
//     };

//     if (loading) {
//         return <div className="p-4 text-center">Loading issue details...</div>;
//     }

//     if (!issue) {
//         return <div className="p-4 text-center">Issue not found.</div>;
//     }

//     const getLocationCoords = () => {
//         if (!issue.location || typeof issue.location !== 'string') return null;
//         const coords = issue.location.split(',').map(c => parseFloat(c.trim()));
//         if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
//             return coords;
//         }
//         return null;
//     };
//     const locationCoords = getLocationCoords();

//     const assignedDeptInfo = departments.find(dept => dept.name === issue.assignedDepartment);
//     const departmentEmail = assignedDeptInfo ? assignedDeptInfo.email : null;

//     let gmailLink = '';
//     if (departmentEmail) {
//         const subject = `Regarding Issue ID: ${id} - ${issue.type}`;
        
//         // Conditionally add the image link to the body text
//         const imageLinkText = issue.image 
//             ? `\n- View Attached Image: ${issue.image}` 
//             : '';

//         const body = `
// Dear ${issue.assignedDepartment},

// Please review the following reported issue:

// - Issue ID: ${id}
// - Type: ${issue.type || 'N/A'}
// - Location: ${issue.location || 'N/A'}
// - Reported On: ${issue.createdAt || 'N/A'}
// - Priority: ${priority} 
// - Status: ${status}${imageLinkText}

// Description:
// ${issue.description || 'N/A'}

// Thank you.
//         `;
//         const gmailBaseUrl = "https://mail.google.com/mail/?view=cm&fs=1";
//         gmailLink = `${gmailBaseUrl}&to=${encodeURIComponent(departmentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
//     }

//     return (
//         <div className="issue-details-page p-4">
//             <Link to="/issues" className="back-link mb-3 d-inline-block">
//                 <i className="bi bi-arrow-left me-2"></i> Back to Issues
//             </Link>
//             <h2 className="issue-id">{id}</h2>
//             <p className="issue-title">{issue.type || 'N/A'}</p>

//             <Row className="mt-4 g-4">
//                 <Col md={8}>
//                     <Card className="detail-card mb-4">
//                         <Card.Body>
//                             <h5>Complaint Details</h5>
//                             <div className="mb-3">
//                                 <h6 className="detail-label">Description</h6>
//                                 <p className="detail-text">{issue.description || 'N/A'}</p>
//                             </div>
                            
//                             {issue.tags && (
//                                 <div className="mb-3">
//                                     <h6 className="detail-label">Tags</h6>
//                                     <div className="d-flex flex-wrap">
//                                         {issue.tags.split(',').map((tag, index) => (
//                                             <span key={index} className="badge-tag me-2 mb-2">
//                                                 {tag.trim()}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             <div className="mb-3">
//                                 <h6 className="detail-label">Location</h6>
//                                 <p className="mb-1"><i className="bi bi-geo-alt-fill me-1"></i> {issue.location || 'N/A'}</p>
//                                 {locationCoords && (
//                                     <Link to="/map" state={{ center: locationCoords }} className="fw-bold">
//                                         View on Map
//                                     </Link>
//                                 )}
//                             </div>
//                             <div className="mb-3">
//                                 <h6 className="detail-label">Reported On</h6>
//                                 <p className="mb-0"><i className="bi bi-clock-fill me-1"></i> {issue.createdAt || 'N/A'}</p>
//                             </div>
//                         </Card.Body>
//                     </Card>

//                     <Card className="detail-card mb-4">
//                         <Card.Body>
//                             <h5><i className="bi bi-paperclip me-2"></i>Media & Evidence</h5>
//                             {issue.image && (
//                                 <div className="media-container mb-3">
//                                     <div className="media-header d-flex justify-content-between align-items-center mb-2">
//                                         <span className="media-type"><i className="bi bi-image-fill me-1"></i> Photo</span>
//                                         <a href={issue.image} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
//                                     </div>
//                                     <img src={issue.image} alt="Issue evidence" className="img-fluid rounded border" />
//                                 </div>
//                             )}
//                             {issue.audio && (
//                                 <div className="media-container mt-4">
//                                     <div className="media-header d-flex justify-content-between align-items-center mb-2">
//                                         <span className="media-type"><i className="bi bi-mic-fill me-1"></i> Audio</span>
//                                         <a href={issue.audio} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
//                                     </div>
//                                     <audio controls className="w-100">
//                                         <source src={issue.audio} type="audio/webm" />
//                                         Your browser does not support the audio element.
//                                     </audio>
//                                 </div>
//                             )}
//                             {!issue.image && !issue.audio && (
//                                 <p className="text-muted">No media was provided for this issue.</p>
//                             )}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col md={4}>
//                     <div className="right-sidebar">
//                         <Card className="sidebar-card status-card mb-4">
//                             <Card.Body>
//                                 <h5>Status & Priority</h5>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Update Status</Form.Label>
//                                     <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
//                                         <option value="pending">Pending</option>
//                                         <option value="Assigned">Assigned</option>
//                                         <option value="In Progress">In Progress</option>
//                                         <option value="Resolved">Resolved</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Update Priority</Form.Label>
//                                     <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
//                                         <option value="Low">Low</option>
//                                         <option value="Medium">Medium</option>
//                                         <option value="High">High</option>
//                                         <option value="Critical">Critical</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Card.Body>
//                         </Card>

//                         <Card className="sidebar-card mb-4">
//                             <Card.Body>
//                                 <h5>Assigned Department</h5>
//                                 <p className="fw-bold mb-2">
//                                     <i className="bi bi-building-fill me-2"></i>
//                                     {issue.assignedDepartment || 'Unassigned'}
//                                 </p>
//                                 {departmentEmail && (
//                                     <Button 
//                                         as="a" 
//                                         href={gmailLink} 
//                                         target="_blank" 
//                                         rel="noopener noreferrer"
//                                         variant="outline-primary" 
//                                         className="w-100 mt-2"
//                                     >
//                                         <i className="bi bi-envelope-fill me-2"></i>
//                                         Draft Email in Gmail
//                                     </Button>
//                                 )}
//                             </Card.Body>
//                         </Card>
                        
//                         <Button variant="primary" className="w-100" onClick={handleUpdate}>
//                             Save Changes
//                         </Button>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default IssueDetailsPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseconfig";
import { departments } from '../lib/departments';
import emailjs from '@emailjs/browser';

const IssueDetailsPage = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');

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
                if (issueData.createdAt && typeof issueData.createdAt.toDate === 'function') {
                    issueData.createdAt = issueData.createdAt.toDate().toLocaleString();
                }
                setIssue(issueData);
                setStatus(issueData.status || 'pending');
                setPriority(issueData.priority || 'Medium');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleUpdate = async () => {
        if (!id) return;

        // 1. Update Firestore first
        const docRef = doc(db, "reports", id);
        try {
            await updateDoc(docRef, {
                status: status,
                priority: priority
            });

            // 2. CHECK: Did we just mark it as Resolved?
            if (status === "Resolved") {
                console.log("Status is Resolved. Attempting to send email...");

                // Prepare the email parameters
                const emailParams = {
                    user_name: "Citizen", // Default since userName is missing in DB
                    user_email: issue.userEmail,
                    issue_desc: issue.description,
                    issue_id: id,
                    issue_type: issue.type,
                    resolution_date: new Date().toLocaleDateString()
                };

                // Send the email
                try {
                    await emailjs.send(
                        "service_1fioyb8",      // Your Service ID
                        "template_xjfj6ho",     // Your Template ID
                        emailParams,
                        "Kx-_Am2x6azE2uewb"       // Your Public Key
                    );
                    alert('Issue updated & Resolution Email sent to user! ✅');
                } catch (emailError) {
                    console.error("Firebase updated, but Email failed:", emailError);
                    alert('Issue updated, but failed to send email. Check console for errors.');
                }
            } else {
                alert('Issue updated successfully!');
            }

            fetchIssueDetails(); 
        } catch (error) {
            console.error("Error updating document: ", error);
            alert('Failed to update issue.');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading issue details...</div>;
    }

    if (!issue) {
        return <div className="p-4 text-center">Issue not found.</div>;
    }

    const getLocationCoords = () => {
        if (!issue.location || typeof issue.location !== 'string') return null;
        const coords = issue.location.split(',').map(c => parseFloat(c.trim()));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            return coords;
        }
        return null;
    };
    const locationCoords = getLocationCoords();

    const assignedDeptInfo = departments.find(dept => dept.name === issue.assignedDepartment);
    const departmentEmail = assignedDeptInfo ? assignedDeptInfo.email : null;

    let gmailLink = '';
    if (departmentEmail) {
        const subject = `Regarding Issue ID: ${id} - ${issue.type}`;
        
        const imageLinkText = issue.image 
            ? `\n- View Attached Image: ${issue.image}` 
            : '';

        const body = `
Dear ${issue.assignedDepartment},

Please review the following reported issue:

- Issue ID: ${id}
- Type: ${issue.type || 'N/A'}
- Location: ${issue.location || 'N/A'}
- Reported On: ${issue.createdAt || 'N/A'}
- Priority: ${priority} 
- Status: ${status}${imageLinkText}

Description:
${issue.description || 'N/A'}

Thank you.
        `;
        const gmailBaseUrl = "https://mail.google.com/mail/?view=cm&fs=1";
        gmailLink = `${gmailBaseUrl}&to=${encodeURIComponent(departmentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.trim())}`;
    }

    return (
        <div className="issue-details-page p-4">
            <Link to="/issues" className="back-link mb-3 d-inline-block">
                <i className="bi bi-arrow-left me-2"></i> Back to Issues
            </Link>
            <h2 className="issue-id">{id}</h2>
            <p className="issue-title">{issue.type || 'N/A'}</p>

            <Row className="mt-4 g-4">
                <Col md={8}>
                    <Card className="detail-card mb-4">
                        <Card.Body>
                            <h5>Complaint Details</h5>
                            <div className="mb-3">
                                <h6 className="detail-label">Description</h6>
                                <p className="detail-text">{issue.description || 'N/A'}</p>
                            </div>
                            
                            {issue.tags && (
                                <div className="mb-3">
                                    <h6 className="detail-label">Tags</h6>
                                    <div className="d-flex flex-wrap">
                                        {issue.tags.split(',').map((tag, index) => (
                                            <span key={index} className="badge-tag me-2 mb-2">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-3">
                                <h6 className="detail-label">Location</h6>
                                <p className="mb-1"><i className="bi bi-geo-alt-fill me-1"></i> {issue.location || 'N/A'}</p>
                                {locationCoords && (
                                    <Link to="/map" state={{ center: locationCoords }} className="fw-bold">
                                        View on Map
                                    </Link>
                                )}
                            </div>
                            <div className="mb-3">
                                <h6 className="detail-label">Reported On</h6>
                                <p className="mb-0"><i className="bi bi-clock-fill me-1"></i> {issue.createdAt || 'N/A'}</p>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="detail-card mb-4">
                        <Card.Body>
                            <h5><i className="bi bi-paperclip me-2"></i>Media & Evidence</h5>
                            {issue.image && (
                                <div className="media-container mb-3">
                                    <div className="media-header d-flex justify-content-between align-items-center mb-2">
                                        <span className="media-type"><i className="bi bi-image-fill me-1"></i> Photo</span>
                                        <a href={issue.image} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
                                    </div>
                                    <img src={issue.image} alt="Issue evidence" className="img-fluid rounded border" />
                                </div>
                            )}
                            {issue.audio && (
                                <div className="media-container mt-4">
                                    <div className="media-header d-flex justify-content-between align-items-center mb-2">
                                        <span className="media-type"><i className="bi bi-mic-fill me-1"></i> Audio</span>
                                        <a href={issue.audio} download target="_blank" rel="noopener noreferrer"><FaDownload /></a>
                                    </div>
                                    <audio controls className="w-100">
                                        <source src={issue.audio} type="audio/webm" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                            {!issue.image && !issue.audio && (
                                <p className="text-muted">No media was provided for this issue.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <div className="right-sidebar">
                        <Card className="sidebar-card status-card mb-4">
                            <Card.Body>
                                <h5>Status & Priority</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label>Update Status</Form.Label>
                                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Update Priority</Form.Label>
                                    <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>

                        <Card className="sidebar-card mb-4">
                            <Card.Body>
                                <h5>Assigned Department</h5>
                                <p className="fw-bold mb-2">
                                    <i className="bi bi-building-fill me-2"></i>
                                    {issue.assignedDepartment || 'Unassigned'}
                                </p>
                                {departmentEmail && (
                                    <Button 
                                        as="a" 
                                        href={gmailLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        variant="outline-primary" 
                                        className="w-100 mt-2"
                                    >
                                        <i className="bi bi-envelope-fill me-2"></i>
                                        Draft Email in Gmail
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                        
                        <Button variant="primary" className="w-100" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default IssueDetailsPage;
