import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaMoon, FaSun, FaBell, FaEnvelope, FaSave, FaMobileAlt } from 'react-icons/fa';

const SettingsPage = () => {
    // Load saved preferences from LocalStorage
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
    }, [darkMode]);

    const handleSave = () => {
        console.log("Saving Settings:", { darkMode, emailAlerts, smsAlerts });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-dark dark-text-white">⚙️ Settings & Preferences</h2>

            {showSuccess && (
                <Alert variant="success" className="shadow-sm">
                    <i className="bi bi-check-circle-fill me-2"></i> Settings saved successfully!
                </Alert>
            )}

            <Row>
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#6c757d' }}>
                            <FaSun className="me-2"/> Appearance
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h6 className="mb-1 fw-bold">Dark Mode</h6>
                                    <small className="text-muted">Switch between light and dark themes.</small>
                                </div>
                                <Form.Check 
                                    type="switch"
                                    id="dark-mode-switch"
                                    className="fs-4"
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                />
                            </div>
                            <div className="p-3 bg-light rounded text-center text-muted small border">
                                {darkMode ? <FaMoon className="text-primary mb-1 fs-5"/> : <FaSun className="text-warning mb-1 fs-5"/>}
                                <br/>
                                Currently using {darkMode ? "Dark" : "Light"} Theme
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100 border-0">
                        <Card.Header className="text-white fw-bold" style={{ backgroundColor: '#6c757d' }}>
                            <FaBell className="me-2"/> Notifications
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div>
                                    <h6 className="mb-1 fw-bold"><FaEnvelope className="me-2 text-secondary"/>Email Alerts</h6>
                                    <small className="text-muted">Receive updates on ticket status via email.</small>
                                </div>
                                <Form.Check 
                                    type="switch" 
                                    checked={emailAlerts}
                                    onChange={(e) => setEmailAlerts(e.target.checked)}
                                />
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <h6 className="mb-1 fw-bold"><FaMobileAlt className="me-2 text-secondary"/>SMS Alerts</h6>
                                    <small className="text-muted">Get critical alerts via SMS (High Priority only).</small>
                                </div>
                                <Form.Check 
                                    type="switch"
                                    checked={smsAlerts}
                                    onChange={(e) => setSmsAlerts(e.target.checked)}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* SAVE BUTTON */}
            <div className="text-end">
                <Button variant="primary" size="lg" className="px-5 fw-bold shadow" onClick={handleSave}>
                    <FaSave className="me-2"/> Save Changes
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;
