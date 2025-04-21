import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  CardTitle,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddReport = () => {
  const [sessionId, setSessionId] = useState("");
  const [sessionText, setSessionText] = useState("");
  const [similarity, setSimilarity] = useState("");
  const [badWords, setBadWords] = useState([{ start_time: "", end_time: "" }]);
  const [noise, setNoise] = useState([{ start_time: "", end_time: "" }]);
  const [upnormalBehaviour, setUpnormalBehaviour] = useState([{ start_time: "", end_time: "" }]);
  const [timeTracking, setTimeTracking] = useState([{ start_time: "", end_time: "", status: "Speak" }]);

  const handleAddRow = (setState, data) => {
    setState((prev) => [...prev, data]);
  };

  const handleRemoveRow = (setState, index) => {
    setState((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reportData = {
      session_id: sessionId,
      session_text: sessionText,
      similarity: Number(similarity),
      bad_word: badWords,
      noise,
      upnormal_behaviour: upnormalBehaviour,
      time_tracking: timeTracking,
    };
    console.log("Submitted Report:", reportData);
  };

  document.title = "Add Report | Veltrix - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs  title="Reports" breadcrumbItem="Add Report" />
          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Add Report</CardTitle>
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <Label>Session ID</Label>
                      <Input type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <Label>Session Text</Label>
                      <Input type="text" value={sessionText} onChange={(e) => setSessionText(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <Label>Similarity</Label>
                      <Input type="number" min="0" max="100" value={similarity} onChange={(e) => setSimilarity(e.target.value)} />
                    </div>
                    {["Bad Words", "Noise", "Upnormal Behaviour"].map((category, index) => {
                      const stateSetters = [setBadWords, setNoise, setUpnormalBehaviour];
                      const stateValues = [badWords, noise, upnormalBehaviour];
                      return (
                        <div key={index} className="mb-3">
                          <Label>{category}</Label>
                          {stateValues[index].map((entry, idx) => (
                            <Row key={idx} className="mb-2">
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="Start Time"
                                  value={entry.start_time}
                                  onChange={(e) => {
                                    const updated = [...stateValues[index]];
                                    updated[idx].start_time = e.target.value;
                                    stateSetters[index](updated);
                                  }}
                                />
                              </Col>
                              <Col md="5">
                                <Input
                                  type="text"
                                  placeholder="End Time"
                                  value={entry.end_time || ""}
                                  onChange={(e) => {
                                    const updated = [...stateValues[index]];
                                    updated[idx].end_time = e.target.value;
                                    stateSetters[index](updated);
                                  }}
                                />
                              </Col>
                              <Col md="2">
                                <Button color="danger" onClick={() => handleRemoveRow(stateSetters[index], idx)}>
                                  Delete
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <Button color="success" onClick={() => handleAddRow(stateSetters[index], { start_time: "", end_time: "" })}>
                            Add {category}
                          </Button>
                        </div>
                      );
                    })}
                    <div className="mb-3">
                      <Label>Time Tracking</Label>
                      {timeTracking.map((entry, idx) => (
                        <Row key={idx} className="mb-2">
                          <Col md="4">
                            <Input
                              type="text"
                              placeholder="Start Time"
                              value={entry.start_time}
                              onChange={(e) => {
                                const updated = [...timeTracking];
                                updated[idx].start_time = e.target.value;
                                setTimeTracking(updated);
                              }}
                            />
                          </Col>
                          <Col md="4">
                            <Input
                              type="text"
                              placeholder="End Time"
                              value={entry.end_time || ""}
                              onChange={(e) => {
                                const updated = [...timeTracking];
                                updated[idx].end_time = e.target.value;
                                setTimeTracking(updated);
                              }}
                            />
                          </Col>
                          <Col md="2">
                            <Input
                              type="select"
                              value={entry.status}
                              onChange={(e) => {
                                const updated = [...timeTracking];
                                updated[idx].status = e.target.value;
                                setTimeTracking(updated);
                              }}
                            >
                              <option value="Speak">Speak</option>
                              <option value="Silent">Silent</option>
                            </Input>
                          </Col>
                          <Col md="2">
                            <Button color="danger" onClick={() => handleRemoveRow(setTimeTracking, idx)}>
                              Delete
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button color="success" onClick={() => handleAddRow(setTimeTracking, { start_time: "", end_time: "", status: "Speak" })}>
                        Add Time Tracking
                      </Button>
                    </div>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddReport;