import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import axios from "axios";

const AddQm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qmId = queryParams.get("id");

  const [formData, setFormData] = useState({
    id_by_organization: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editMode ? "patch" : "post";
    const url = editMode
      ? `http://localhost:3005/user/${qmId}`
      : "http://localhost:3005/user";

    const { _id, createdAt, updatedAt, __v, role, ...cleanData } = formData;

    try {
      const response = await axios({
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          token,
        },
        data: cleanData,
      });

      const result = response.data;
      if (result.success) {
        toast.success(editMode ? "Quality Member updated successfully!" : "Quality Member added successfully!");
        navigate("/admin/user");
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: " + error);
    }
  };

  useEffect(() => {
    if (qmId) {
      setEditMode(true);
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:3005/user/${qmId}`, {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            setFormData(data.user);
          } else {
            console.error("Error fetching QM:", data.message);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [qmId]);

  document.title = editMode
    ? "Edit user | Veltrix - React Admin"
    : "Add user | Veltrix - React Admin";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Users" breadcrumbItem={editMode ? "Edit user" : "Add user"} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">{editMode ? "Edit QM" : "QM Form"}</CardTitle>
                  <Form className="outer-repeater" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="id_by_organization">ID:</Label>
                      <Input
                        type="text"
                        id="id_by_organization"
                        placeholder="Enter ID..."
                        value={formData.id_by_organization}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label" htmlFor="name">Name:</Label>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Enter Name..."
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label" htmlFor="phone">Phone:</Label>
                      <Input
                        type="text"
                        id="phone"
                        placeholder="Enter phone number..."
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label" htmlFor="email">Email:</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Enter Email..."
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <Label className="form-label" htmlFor="password">Password:</Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter Password..."
                        value={formData.password}
                        onChange={handleChange}
                      />
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

export default AddQm;
