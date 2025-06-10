import React from "react";
import  { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Row, Card, CardBody, Container } from "reactstrap";
import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import logoSm from "../../assets/images/logo-sm.png";

const ReportTemp = () => {
  document.title = "Invoice | Veltrix - React Admin & Dashboard Template";

  const [report, setReport] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reportId = queryParams.get("id");
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const token = localStorage.getItem("token"); // or sessionStorage or context



  useEffect(() => {
    const fetchReport = async () => {
      try {
        console.log(reportId)
        const { data } = await axios.get(`http://localhost:3005/report/${reportId}/tutor-view`);
        console.log(data)
        setReport(data);
      } catch (err) {
        console.error("Failed to fetch tutor report", err);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    const { data } = await axios.patch(`http://localhost:3005/report/${reportId}`, {
      comments: commentText},
      {
      headers: {
        token,
      }
      }
    );

    // Update UI with new comment
    setReport(prev => ({
      ...prev,
       comments:  commentText,
    }));

    // Reset input
    setCommentText("");
    setShowInput(false);
  } catch (err) {
    console.error("Failed to add comment", err);
  }
};


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs  title="Reports" breadcrumbItem="Tutor Report" />
          <Row>
            <div className="col-12">
              <Card>
                <CardBody>
                  <Row>
                    <div className="col-12">
                      <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          <strong>Session # {report?.session_id}</strong>
                        </h4>
                        <h3 className="mt-0">
                          <img src={logoSm} alt="logo" height="24" />
                        </h3>
                      </div>
                      <hr />
                      {report && <Row>
                        <div className="col-6">
                          <div>
                            <h5><strong>Cover All Content</strong></h5>
                            <p>Similarity Score: {report.similarityScore}%</p>

                            <h5><strong>Not Allowed Words</strong></h5>
                            {report.badWords.length > 0 ? (
                              <ul>
                                {report.badWords.map((word, i) => (
                                  <li key={i}>{word}</li>
                                ))}
                              </ul>
                            ) : <p>No inappropriate words detected.</p>}

                            <h5><strong>Session Quietness</strong></h5>
                            <p>{report.sessionQuietness}</p>

                            <h5><strong>Tone of Voice</strong></h5>
                            {report.toneOfVoice.length > 0 ? (
                              <ul>
                                {report.toneOfVoice.map((note, i) => (
                                  <li key={i}>{note}</li>
                                ))}
                              </ul>
                            ) : <p>Normal tone throughout the session.</p>}

                            <h5><strong>Total Silence Duration</strong></h5>
                            <p>{report.totalSilenceDuration} minutes</p>

                            <h5><strong>Tutor Flags</strong></h5>
                            {report.tutorFlags.length > 0 ? (
                              <ul>
                                {report.tutorFlags.map((flag, i) => (
                                  <li key={i}>{flag.comment}</li>
                                ))}
                              </ul>
                            ) : <p>No issues flagged.</p>}
                            <h5><strong>Comments</strong></h5>
                            {report.comments ? report.comments : <p>No comments.</p>}
                          </div>
              
                        </div>
                        
                      </Row>}
                      {report && <Row>
                        <div className="col-6 mt-4 text-end">
                          {(location.pathname.startsWith("/admin") || location.pathname.startsWith("/qm")) && (
                            <div className="mt-3">
                              {!showInput ? (
                                <button className="btn btn-primary" onClick={() => setShowInput(true)}>
                                  Add Comments
                                </button>
                              ) : (
                                <div>
                                  <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Type your comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                  />
                                  <button className="btn btn-success mt-2" onClick={handleAddComment}>
                                    Submit Comment
                                  </button>
                                  <button className="btn btn-secondary mt-2 ms-2" onClick={() => setShowInput(false)}>
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      </Row>}
                    </div>
                  </Row>

                
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );

};

export default ReportTemp;