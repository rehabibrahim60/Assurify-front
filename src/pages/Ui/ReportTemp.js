import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Row, Card, CardBody, Container, Badge, Alert } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import logoSm from "../../assets/images/A-logo2.png";

const ReportTemp = () => {
  document.title = "Tutor Report | Assurify - Educational Quality Management";

  const [report, setReport] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get("id");
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log(reportId);
        const { data } = await axios.get(`http://localhost:3005/report/${reportId}/tutor-view`);
        console.log(data);
        setReport(data);
      } catch (err) {
        console.error("Failed to fetch tutor report", err);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await axios.patch(`http://localhost:3005/report/${reportId}`, {
        comments: commentText
      }, {
        headers: {
          token,
        }
      });

      setReport(prev => ({
        ...prev,
        comments: commentText,
      }));

      setCommentText("");
      setShowInput(false);
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score) => {
    if (score <= 50) return "danger";
    if (score <= 75) return "warning";
    return "success";
  };

  const getScoreIcon = (score) => {
    if (score <= 50) return "⚠️";
    if (score <= 75) return "📊";
    return "✅";
  };

  const getSilenceColor = (duration) => {
    return duration > 2 ? "warning" : "success";
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Quality Management" breadcrumbItem="Session Analysis Report" />
          
          {report && (
            <>
              {/* Header Section */}
              <Row className="mb-4">
                <div className="col-12">
                  <Card className="border-0 shadow-sm">
                    <CardBody className="bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      <div className="d-flex justify-content-between align-items-center text-white">
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center me-3 ">
                            <img src={logoSm} alt="logo" height="60" />
                          </div>
                          <div>
                            <h4 className="mb-1 text-black">Session Analysis Report</h4>
                            <p className="mb-0 text-black">Comprehensive quality assessment and performance metrics</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <h5 className="mb-1 text-white">Session ID</h5>
                          <Badge color="light" className="font-size-12">#{report?.session_id}</Badge>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Row>

              <Row>
                {/* Tutor Information Section */}
                <div className="col-lg-4 col-md-6">
                  <Card className="border-0 shadow-sm h-100">
                    <CardBody>
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm rounded-circle bg-primary bg-soft d-flex align-items-center justify-content-center me-3">
                          <i className="bx bx-user font-size-16 text-primary"></i>
                        </div>
                        <h5 className="card-title mb-0 text-primary">Instructor Profile</h5>
                      </div>
                      
                      {report.tutor && (
                        <div className="space-y-3">
                          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <span className="text-muted font-size-13">Full Name</span>
                            <span className="fw-medium">{report.tutor.name}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <span className="text-muted font-size-13">National ID</span>
                            <span className="fw-medium font-monospace">{report.tutor.national_id}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center py-2">
                            <span className="text-muted font-size-13">Organization ID</span>
                            <Badge color="secondary" className="font-size-11">{report.tutor.id_by_organization}</Badge>
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <div className="col-lg-8 col-md-6">
                  <Card className="border-0 shadow-sm h-100">
                    <CardBody>
                      <div className="d-flex align-items-center mb-4">
                        <div className="avatar-sm rounded-circle bg-success bg-soft d-flex align-items-center justify-content-center me-3">
                          <i className="bx bx-bar-chart-alt-2 font-size-16 text-success"></i>
                        </div>
                        <h5 className="card-title mb-0 text-success">Performance Analytics</h5>
                      </div>

                      <Row>
                        {/* Content Coverage */}
                        <div className="col-md-6 col-sm-6 mb-4">
                          <div className="border rounded p-3 h-100 bg-light bg-gradient">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="text-muted font-size-13">Content Coverage</span>
                              <span className="font-size-18">{getScoreIcon(report.similarityScore)}</span>
                            </div>
                            <div className="d-flex align-items-end">
                              <h3 className={`mb-0 text-${getScoreColor(report.similarityScore)}`}>
                                {report.similarityScore}%
                              </h3>
                              <Badge 
                                color={getScoreColor(report.similarityScore)} 
                                className="ms-2 font-size-10"
                              >
                                {report.similarityScore <= 50 ? 'NEEDS IMPROVEMENT' : 
                                 report.similarityScore <= 75 ? 'SATISFACTORY' : 'EXCELLENT'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Session Quality */}
                        <div className="col-md-6 col-sm-6 mb-4">
                          <div className="border rounded p-3 h-100 bg-light bg-gradient">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="text-muted font-size-13">Audio Quality</span>
                              <span className="font-size-18">
                                {report.sessionQuietness === 'Clear' ? '🔊' : '🔇'}
                              </span>
                            </div>
                            <div className="d-flex align-items-end">
                              <h5 className={`mb-0 text-${report.sessionQuietness === 'Clear' ? 'success' : 'warning'}`}>
                                {report.sessionQuietness}
                              </h5>
                              <Badge 
                                color={report.sessionQuietness === 'Clear' ? 'success' : 'warning'} 
                                className="ms-2 font-size-10"
                              >
                                {report.sessionQuietness === 'Clear' ? 'OPTIMAL' : 'REVIEW NEEDED'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Silence Duration */}
                        <div className="col-md-6 col-sm-6 mb-4">
                          <div className="border rounded p-3 h-100 bg-light bg-gradient">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="text-muted font-size-13">Total Silence</span>
                              <span className="font-size-18">⏱️</span>
                            </div>
                            <div className="d-flex align-items-end">
                              <h5 className={`mb-0 text-${getSilenceColor(report.totalSilenceDuration)}`}>
                                {report.totalSilenceDuration} min
                              </h5>
                              <Badge 
                                color={getSilenceColor(report.totalSilenceDuration)} 
                                className="ms-2 font-size-10"
                              >
                                {report.totalSilenceDuration > 2 ? 'HIGH' : 'NORMAL'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Engagement Level */}
                        <div className="col-md-6 col-sm-6 mb-4">
                          <div className="border rounded p-3 h-100 bg-light bg-gradient">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="text-muted font-size-13">Overall Rating</span>
                              <span className="font-size-18">⭐</span>
                            </div>
                            <div className="d-flex align-items-end">
                              <h5 className="mb-0 text-info">
                                {report.tutorFlags.length === 0 && report.badWords.length === 0 ? 'Excellent' : 
                                 report.tutorFlags.length <= 2 ? 'Good' : 'Needs Review'}
                              </h5>
                              <Badge 
                                color={report.tutorFlags.length === 0 ? 'success' : 'warning'} 
                                className="ms-2 font-size-10"
                              >
                                AUTOMATED
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Row>

              {/* Detailed Analysis Section */}
              <Row className="mt-4">
                <div className="col-12">
                  <Card className="border-0 shadow-sm">
                    <CardBody>
                      <div className="d-flex align-items-center mb-4">
                        <div className="avatar-sm rounded-circle bg-warning bg-soft d-flex align-items-center justify-content-center me-3">
                          <i className="bx bx-search-alt font-size-16 text-warning"></i>
                        </div>
                        <h5 className="card-title mb-0 text-warning">Detailed Quality Analysis</h5>
                      </div>

                      <Row>
                        {/* Content Issues */}
                        <div className="col-lg-6 mb-4">
                          <div className="border rounded p-4">
                            <h6 className="text-danger mb-3">
                              <i className="bx bx-shield-x me-2"></i>
                              Inappropriate Content Detection
                            </h6>
                            {report.badWords.length > 0 ? (
                              <Alert color="danger" className="border-0">
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="bx bx-error-circle font-size-16"></i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6 className="alert-heading font-size-14 mb-2">Issues Detected</h6>
                                    <ul className="mb-0 ps-3">
                                      {report.badWords.map((word, i) => (
                                        <li key={i} className="font-size-13">{word}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </Alert>
                            ) : (
                              <div className="text-success d-flex align-items-center">
                                <i className="bx bx-check-shield font-size-18 me-2"></i>
                                <span className="fw-medium">No inappropriate content detected</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Voice Analysis */}
                        <div className="col-lg-6 mb-4">
                          <div className="border rounded p-4">
                            <h6 className="text-info mb-3">
                              <i className="bx bx-microphone me-2"></i>
                              Voice Pattern Analysis
                            </h6>
                            {report.toneOfVoice.length > 0 ? (
                              <Alert color="warning" className="border-0">
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="bx bx-volume-full font-size-16"></i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6 className="alert-heading font-size-14 mb-2">Voice Fluctuations Detected</h6>
                                    <ul className="mb-0 ps-3">
                                      {report.toneOfVoice.map((note, i) => (
                                        <li key={i} className="font-size-13">{note}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </Alert>
                            ) : (
                              <div className="text-success d-flex align-items-center">
                                <i className="bx bx-check-circle font-size-18 me-2"></i>
                                <span className="fw-medium">Consistent and appropriate tone maintained</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* System Flags */}
                        <div className="col-12 mb-4">
                          <div className="border rounded p-4">
                            <h6 className="text-primary mb-3">
                              <i className="bx bx-flag me-2"></i>
                              Quality Assurance Flags
                            </h6>
                            {report.tutorFlags.length > 0 ? (
                              <Alert color="danger" className="border-0">
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="bx bx-error font-size-16"></i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <h6 className="alert-heading font-size-14 mb-2">Quality Issues Identified</h6>
                                    <ul className="mb-0 ps-3">
                                      {report.tutorFlags.map((flag, i) => (
                                        <li key={i} className="font-size-13">{flag.comment}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </Alert>
                            ) : (
                              <div className="text-success d-flex align-items-center">
                                <i className="bx bx-shield-check font-size-18 me-2"></i>
                                <span className="fw-medium">Session meets all quality standards</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Comments Section */}
                        <div className="col-12">
                          <div className="border rounded p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <h6 className="text-secondary mb-0">
                                <i className="bx bx-chat me-2"></i>
                                Quality Manager Comments
                              </h6>
                              {(location.pathname.startsWith("/admin") || location.pathname.startsWith("/qm")) && (
                                !showInput && (
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setShowInput(true)}
                                  >
                                    <i className="bx bx-plus me-1"></i>
                                    Add Comments
                                  </button>
                                )
                              )}
                            </div>

                            {report.comments ? (
                              <Alert color="info" className="border-0 mb-3">
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <i className="bx bx-comment-detail font-size-16"></i>
                                  </div>
                                  <div className="flex-grow-1 ms-3">
                                    <p className="mb-0 font-size-13">{report.comments}</p>
                                  </div>
                                </div>
                              </Alert>
                            ) : (
                              <div className="text-muted d-flex align-items-center mb-3">
                                <i className="bx bx-message-dots font-size-18 me-2"></i>
                                <span className="font-size-13">No additional comments from quality management team</span>
                              </div>
                            )}

                            {showInput && (
                              <div className="mt-3">
                                <textarea
                                  className="form-control border-0 bg-light"
                                  rows="4"
                                  placeholder="Provide detailed feedback, recommendations, or additional observations..."
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                />
                                <div className="d-flex gap-2 mt-3">
                                  <button 
                                    className="btn btn-success"
                                    onClick={handleAddComment}
                                    disabled={isSubmitting || !commentText.trim()}
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Submitting...
                                      </>
                                    ) : (
                                      <>
                                        <i className="bx bx-check me-1"></i>
                                        Submit Comment
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    className="btn btn-light"
                                    onClick={() => {
                                      setShowInput(false);
                                      setCommentText("");
                                    }}
                                    disabled={isSubmitting}
                                  >
                                    <i className="bx bx-x me-1"></i>
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Row>
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </>
          )}

          {!report && (
            <Row>
              <div className="col-12">
                <Card className="border-0 shadow-sm">
                  <CardBody className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                    <p className="text-muted mt-3 mb-0">Loading session analysis report...</p>
                  </CardBody>
                </Card>
              </div>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReportTemp;