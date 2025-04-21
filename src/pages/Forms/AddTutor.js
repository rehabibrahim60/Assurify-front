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
  CardTitle,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";

const AddTutor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tutorId = queryParams.get("id");
  const [formData, setFormData] = useState({
    id_by_organization: "",
    name: "",
    national_id: "",
    phone: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (tutorId) {
      setEditMode(true);
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:3005/tutor/${tutorId}`, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data.success) {
            setFormData(res.data.tutor);
          } else {
            console.error("Error fetching tutor:", res.data.message);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [tutorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editMode ? "patch" : "post";
    const url = editMode
      ? `http://localhost:3005/tutor/${tutorId}`
      : `http://localhost:3005/tutor`;

    const { _id, createdAt, updatedAt, __v, ...cleanData } = formData;

    try {
      const response = await axios({
        method,
        url,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: cleanData,
      });

      if (response.data.success) {
        toast.success(editMode ? "Tutor updated successfully!" : "Tutor added successfully!");
        navigate("/admin/tutor");
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  document.title = editMode
    ? "Edit Tutor | Veltrix - React Admin"
    : "Add Tutor | Veltrix - React Admin";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tutors" breadcrumbItem={editMode ? "Edit Tutor" : "Add Tutor"} />

          <Row>
            <Col xs={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">{editMode ? "Edit Tutor" : "Tutor Form"}</CardTitle>
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <Label htmlFor="id_by_organization">ID</Label>
                      <Input
                        type="text"
                        id="id_by_organization"
                        value={formData.id_by_organization}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="national_id">National ID</Label>
                      <Input
                        type="text"
                        id="national_id"
                        value={formData.national_id}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
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

export default AddTutor;
