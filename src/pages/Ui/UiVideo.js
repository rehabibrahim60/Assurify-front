import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, CardTitle, Col, Container, Row, Button, Form, Label, Input } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiVideo = () => {
  document.title = "Session Record | Veltrix - React Admin & Dashboard Template";
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("id");
  const token = localStorage.getItem("token");

  const [reportNotFound, setReportNotFound] = useState(false);
  const [tutor, setTutor] = useState({ id: "", name: "" });
  const [session, setSession] = useState({ id: "", date: "", video: "", pdfLink: "" });
  const [report, setReport] = useState({
    _id:"",
    similarity: 0,
    bad_word: [],
    noisy_detection: "",
    key_points: "",
    summary: "",
    transcript: "",
    abnormal_times: [],
    time_tracking: [],
    total_silence_duration: "",
    plot: "", // base64 image string
  });
  
  const [showNotification, setShowNotification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newBadword, setNewBadword] = useState("");



  useEffect(() => {
    if (sessionId) {
      axios.get(`http://localhost:3005/session/${sessionId}`, {
        headers: { token },
      })
      .then(res => setSession(res.data.session))
      .catch(err => console.error("Error fetching session:", err));
  
      axios.get(`http://localhost:3005/report/${sessionId}/session`, {
        headers: { token },
      })
      .then(res => {
        setReport(res.data.report);
        setReportNotFound(false); // reset if successful
      })
      .catch(err => {
        if (err.response && err.response.data?.message === "report not found") {
          setReportNotFound(true);
        } else {
          console.error("Error fetching report:", err);
        }
      });

    }
  }, [sessionId]);
  

  if (!session || !report) {
    return <p>Loading...</p>;
  }
  
  

  const handleArrayChange = (index, field, category, value) => {
    setReport((prev) => {
      const updatedArray = [...prev[category]];
      updatedArray[index][field] = value;
      return { ...prev, [category]: updatedArray };
    });
  };

  const handleAddRow = (category) => {
    const newRow = category === "time_tracking"
  ? { start_frame: "", end_frame: "" } // ✅ was incorrectly using start_time
  : category === "tutorFlags"
  ? { flag_name: "Late", comment: "" }
  : category === "bad_word"
  ? { word: "" }
  : { start_time: "", end_time: "" };

    setReport((prev) => ({ ...prev, [category]: [...prev[category], newRow] }));
  };

  const handleRemoveRow = (category, index) => {
    setReport((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleClick = () => {
    const redirectPath = location.pathname.startsWith("/admin") ? "/admin/report-temp" : "/qm/report-temp";
    navigate(redirectPath/*, { state: { session: fullReport } }*/);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionReport({ ...sessionReport, [name]: value });
  };
  

  const handleEditSaveClick = async () => {
    if (isEditing) {
      try {
        console.log(report);
        if (!report || !report._id) {
          console.error("Missing report or report._id");
          return;
        }

        if (!token) {
          console.warn("Missing token!");
        }
        
        const {
          _id,
          createdAt,
          updatedAt,
          __v,
          plot,
          ...rest      // send the rest of the report fields
        } = report
        await axios.patch(`http://localhost:3005/report/${report._id}`, rest, {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
          withCredentials: true, // only needed if backend sets cookies
        });
        
  
        // Success handling
        setIsEditing(false);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
  
      } catch (error) {
        console.error("Save Error:", error);
      }
    } else {
      setIsEditing(true);
    }
  };
  
  const handleAddBadword = () => {
    if (!newBadword.trim()) return;
    setReport({
      ...report,
      bad_word: [...report.bad_word, { word: newBadword }],
    });
    setNewBadword(""); // Clear input
  };
  
  const handleRemoveBadword = (index) => {
    const updated = [...report.bad_word];
    updated.splice(index, 1);
    setReport({ ...report, bad_word: updated });
  };
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);
  
    const fullReport = {
      sessionId: session.id,
      tutorId: tutor.id,
      tutorName: tutor.name,
      sessionDate: session.date,
      pdfLink: session.pdfLink,
      video: session.video,
      ...report,
    };
  
    const redirectPath = location.pathname.startsWith("/admin") ? "/admin/video" : "/qm/video";
    navigate(redirectPath, { state: { session: fullReport } });
  };
  


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Sessions" breadcrumbItem="Video" />

          <Row>
            <Col lg={10}>
              <Card>
                <CardBody>
                  <CardTitle className="text-center fs-3 fw-bold">Session Record</CardTitle>

                  {/* Notification with animation */}
                  <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md z-50 transition-all duration-500 ease-in-out 
                      ${showNotification ? "opacity-100 translate-y-0 bg-green-500" : "opacity-0 -translate-y-4 pointer-events-none"}`}
                  >
                    <span className="text-white">Changes saved successfully</span>
                  </div>

                  <div className="embed-responsive embed-responsive-16by9 ratio ratio-16x9">
                  <iframe
                    title="session-video"
                    className="embed-responsive-item"
                    src={session.video?.url || "https://www.youtube.com/embed/1y_kfWUCFDQ"}
                  />

                  </div>

                  <div className="mt-4 p-3 border rounded bg-light">
                    <h5 className="fw-bold text-center">Session Information</h5>
                    <Row>
                      <Col md="6">
                        <p><strong>Tutor ID:</strong> {session.tutor_id?.id_by_organization}</p>
                        <p><strong>Tutor Name:</strong> {session.assigned_to?.name}</p>
                        <p><strong>Quality Member:</strong> {session.assigned_to?.id_by_organization}</p>
                      </Col>
                      <Col md="6">
                        <p><strong>Session Date:</strong> {session.date}</p>
                        <div><strong>Session PDF:</strong> 
                          {session.pdf_id?.file?.url && (
                            <div>
                              
                              <a href={session.pdf_id.file.url} target="_blank" rel="noreferrer">
                                View PDF
                              </a>
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col md="6">
                      {/* <img
                        src={`data:image/png;base64,${imageBase64}`}
                        alt="Abnormal Audio Regions"
                        
                      /> */}
                      </Col>
                    </Row>
                  </div>

                  
                  {reportNotFound ? (
                    <div className="alert alert-warning mt-4 text-center">
                      <strong>Report not generated yet.</strong> .
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit} className="mt-4">
                    
                    <div className="mb-3">
                      <Label>Similarity</Label>
                      <Input
                        type="number"
                        value={report.similarity}
                        disabled={!isEditing}
                        onChange={(e) => setReport({ ...report, similarity: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Noisy Detection</Label>
                      <Input
                        type="text"
                        value={report.noisy_detection}
                        disabled={!isEditing}
                        onChange={(e) => setReport({ ...report, noisy_detection: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Key Points</Label>
                      <Input
                        type="textarea"
                        value={report.key_points}
                        disabled={!isEditing}
                        onChange={(e) => setReport({ ...report, key_points: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Summary</Label>
                      <Input
                        type="textarea"
                        value={report.summary}
                        disabled={!isEditing}
                        onChange={(e) => setReport({ ...report, summary: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Total Silence Duration</Label>
                      <Input
                        type="text"
                        value={report.total_silence_duration}
                        disabled={!isEditing}
                        onChange={(e) => setReport({ ...report, total_silence_duration: e.target.value })}
                      />

                    </div>
                      <div>
                        <Label className="mt-3">Time Tracking</Label>
                        {report.time_tracking.map((entry, idx) => (
                          <Row key={idx} className="mb-2">
                            <Col md="5">
                              <Input
                                type="text"
                                placeholder="Start Frame"
                                value={entry.start_frame}
                                disabled={!isEditing}
                                onChange={(e) => handleArrayChange(idx, "start_frame", "time_tracking", e.target.value)}
                              />
                            </Col>
                            <Col md="5">
                              <Input
                                type="text"
                                placeholder="End Frame"
                                value={entry.end_frame}
                                disabled={!isEditing}
                                onChange={(e) => handleArrayChange(idx, "end_frame", "time_tracking", e.target.value)}
                              />
                            </Col>
                            <Col md="2">
                              {isEditing && (
                                <Button color="danger" onClick={() => handleRemoveRow("time_tracking", idx)}>
                                  Delete
                                </Button>
                              )}
                            </Col>
                          </Row>
                        ))}
                        {isEditing && (
                          
                          <Button color="success" onClick={() => handleAddRow("time_tracking")}>Add Frame</Button>
                        )}
                      </div>

                      {/* bad words */}
                      <div>
                        <Label className="mt-3">Bad Words</Label>
                        {report.bad_word.length === 0 ? (
                          <p className="text-success">No Bad Words</p>
                        ) : (
                          <>
                            <p className="text-warning">Bad words detected:</p>
                            {report.bad_word.map((entry, idx) => (
                              <Row key={idx} className="mb-2">
                                <Col md="10">
                                  <Input
                                    type="text"
                                    value={entry.word}
                                    disabled={!isEditing}
                                    onChange={(e) => {
                                      const updated = [...report.bad_word];
                                      updated[idx].word = e.target.value;
                                      setReport({ ...report, bad_word: updated });
                                    }}
                                  />

                                </Col>
                                <Col md="2">
                                  {isEditing && (
                                    <Button color="danger" onClick={handleRemoveBadword}>
                                      Delete
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            ))}
                          </>
                        )}
                        {isEditing && (
                          <Button color="success" onClick={() => handleAddRow("bad_word")}>Add Word</Button>
                        )}
                      </div>

                      {/* abnormal times */}
                      <div>
                        <Label className="mt-3">Abnormal Times</Label>
                        {report.abnormal_times.length === 0 ? (
                          <p className="text-success">No Abnormal Times</p>
                        ) : (
                          <>
                            <p className="text-warning">Abnormal times detected:</p>
                            {report.abnormal_times.map((entry, idx) => (
                              <Row key={idx} className="mb-2">
                                <Col md="5">
                                  <Input
                                    type="text"
                                    placeholder="Start Time"
                                    value={entry.start_time}
                                    disabled={!isEditing}
                                    onChange={(e) => handleArrayChange(idx, "start_time", "abnormal_times", e.target.value)}
                                  />
                                </Col>
                                <Col md="5">
                                  <Input
                                    type="text"
                                    placeholder="End Time"
                                    value={entry.end_time}
                                    disabled={!isEditing}
                                    onChange={(e) => handleArrayChange(idx, "end_time", "abnormal_times", e.target.value)}
                                  />
                                </Col>
                                <Col md="2">
                                  {isEditing && (
                                    <Button color="danger" onClick={() => handleRemoveRow("abnormal_times", idx)}>
                                      Delete
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            ))}
                          </>
                        )}
                        {isEditing && (
                          <Button color="success" onClick={() => handleAddRow("abnormal_times")}>Add Time</Button>
                        )}
                      </div>

                      
                      <Label className="mt-3">Abnormal plot</Label>
                      {report.plot && (
                        <div className="my-4 text-center">
                          <img
                            src={`data:image/png;base64,${report.plot}`}
                            alt="Audio Plot"
                            style={{ maxWidth: "100%", height: "auto", border: "1px solid #ddd" }}
                          />
                        </div>
                      )}

                    {/* <div className="mb-3">
                      <Label>Time Tracking</Label>
                      {report.time_tracking.map((entry, idx) => (
                        <Row key={idx} className="mb-2">
                          <Col md="4">
                            <Input
                              type="text"
                              placeholder="Start Time"
                              value={entry.start_time}
                              onChange={(e) => handleArrayChange(idx, "start_time", "timeTracking", e.target.value)}
                              disabled={!isEditing}
                            />
                          </Col>
                          <Col md="4">
                            <Input
                              type="text"
                              placeholder="End Time"
                              value={entry.end_time}
                              onChange={(e) => handleArrayChange(idx, "end_time", "timeTracking", e.target.value)}
                              disabled={!isEditing}
                            />
                          </Col>
                          <Col md="2">
                            <Input
                              type="select"
                              value={entry.status}
                              onChange={(e) => handleArrayChange(idx, "status", "timeTracking", e.target.value)}
                              disabled={!isEditing}
                            >
                              <option value="Speak">Speak</option>
                              <option value="Silent">Silent</option>
                            </Input>
                          </Col>
                          <Col md="2">
                            {isEditing && (
                              <Button color="danger" onClick={() => handleRemoveRow("timeTracking", idx)}>
                                Delete
                              </Button>
                            )}
                          </Col>
                        </Row>
                      ))}
                      {isEditing && (
                        <Button color="success" onClick={() => handleAddRow("timeTracking")}>Add Time Tracking</Button>
                      )}
                    </div> */}

                    {/* <div className="mb-3">
                      <Label>Tutor Flags</Label>
                      {report.tutorFlags.map((entry, idx) => (
                        <Row key={idx} className="mb-2">
                          <Col md="5">
                            <Input
                              type="select"
                              value={entry.flag_name}
                              onChange={(e) => handleArrayChange(idx, "flag_name", "tutorFlags", e.target.value)}
                              disabled={!isEditing}
                            >
                              <option value="Late">Late</option>
                              <option value="Absent">Absent</option>
                              <option value="Unresponsive">Unresponsive</option>
                              <option value="Other">Other</option>
                            </Input>
                          </Col>
                          <Col md="5">
                            <Input
                              type="textarea"
                              placeholder="Comment"
                              value={entry.comment}
                              onChange={(e) => handleArrayChange(idx, "comment", "tutorFlags", e.target.value)}
                              disabled={!isEditing}
                            />
                          </Col>
                          <Col md="2">
                            {isEditing && (
                              <Button color="danger" onClick={() => handleRemoveRow("tutorFlags", idx)}>
                                Delete
                              </Button>
                            )}
                          </Col>
                        </Row>
                      ))}
                      {isEditing && (
                        <Button color="success" onClick={() => handleAddRow("tutorFlags")}>Add Tutor Flag</Button>
                      )}
                    </div> */}

                    <div className="d-flex justify-content-evenly mt-3">
                      <Button onClick={handleEditSaveClick}>
                        {isEditing ? "Save" : "Edit"}
                      </Button>


                      
                    </div>
                    </Form>                    
                  )}

                  <div className="d-flex justify-content-end mt-3">          
                    <Button
                      onClick={handleClick}
                      color="primary"
                    >
                      View Report
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UiVideo;
