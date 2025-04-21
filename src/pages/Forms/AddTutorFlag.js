import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Label,
  Input,
  Button,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";

const AddTutorFlag = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const Tflag_id = queryParams.get("id");

  const [formData, setFormData] = useState({
    session_id: "",
    flag_id: "",
    comment: "",
  });

  const [sessions, setSessions] = useState([]);
  const [flags, setFlags] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch sessions
    axios.get("http://localhost:3005/session", {
      headers: { token },
    })
      .then((res) => setSessions(res.data.sessions || []))
      .catch((err) => console.error("Error fetching sessions:", err));

    // Fetch flags
    axios.get("http://localhost:3005/flag", {
      headers: { token },
    })
      .then((res) => setFlags(res.data.flags || []))
      .catch((err) => console.error("Error fetching flags:", err));

    // Fetch tutor flag if in edit mode
    if (Tflag_id) {
      setEditMode(true);
      axios.get(`http://localhost:3005/tutorFlag/${Tflag_id}`, {
        headers: { token },
      })
        .then((res) => {
          if (res.data.success) {
            setFormData(res.data.tutorFlag);
          } else {
            console.error("Error fetching flag:", res.data.message);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [Tflag_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";
    const { _id, createdAt, updatedAt, __v, ...cleanData } = formData;

    const method = editMode ? "patch" : "post";
    const url = editMode
      ? `http://localhost:3005/tutorFlag/${Tflag_id}`
      : "http://localhost:3005/tutorFlag";

    try {
      const response = await axios({
        method,
        url,
        headers: {
          token,
          "Content-Type": "application/json",
        },
        data: cleanData,
      });

      if (response.data.success) {
        toast.success(editMode ? "Tutor flag updated successfully!" : "Tutor flag added successfully!");
        navigate(`${basePath}/tutorFlag`);
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  document.title = editMode
    ? "Edit Tutor Flag | React Admin Dashboard"
    : "Add Tutor Flag | React Admin Dashboard";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Flags" breadcrumbItem={editMode ? "Edit Tutor Flag" : "Add Tutor Flag"} />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <Label htmlFor="session_id">Session</Label>
                      <Input
                        type="select"
                        id="session_id"
                        value={formData.session_id || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Session</option>
                        {sessions.map((session) => (
                          <option key={session._id} value={session._id}>
                            {session.title}
                          </option>
                        ))}
                      </Input>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="flag_id">Flag</Label>
                      <Input
                        type="select"
                        id="flag_id"
                        value={formData.flag_id || ""}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Flag</option>
                        {flags.map((flag) => (
                          <option key={flag._id} value={flag._id}>
                            {flag.flag_name}
                          </option>
                        ))}
                      </Input>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="comment">Comment</Label>
                      <Input
                        type="textarea"
                        id="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows="3"
                        required
                      />
                    </div>

                    <Button type="submit" color="primary">
                      {editMode ? "Update" : "Submit"}
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

export default AddTutorFlag;
