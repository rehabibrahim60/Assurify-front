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
  Container,
  CardTitle,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { toast } from "react-toastify";

const AddFlag = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const flagId = queryParams.get("id");

  const [formData, setFormData] = useState({
    flag_name: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (flagId) {
      setEditMode(true);
      const token = localStorage.getItem("token");

      axios
        .get(`http://localhost:3005/flag/${flagId}`, {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.success) {
            const selectedFlag = data.flags.find((flag) => flag._id === flagId);
            if (selectedFlag) {
              setFormData({ flag_name: selectedFlag.flag_name });
            } else {
              toast.error("Flag not found in response");
            }
          } else {
            toast.error(`Error fetching flag: ${data.message}`);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("Failed to fetch flag data.");
        });
    }
  }, [flagId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editMode ? "patch" : "post";
    const url = editMode
      ? `http://localhost:3005/flag/${flagId}`
      : `http://localhost:3005/flag`;

    try {
      const response = await axios({
        method: method,
        url: url,
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        data: formData,
      });

      const result = response.data;
      if (result.success) {
        toast.success(editMode ? "Flag updated successfully!" : "Flag added successfully!");
        navigate("/admin/flag");
      } else {
        toast.error("Error: " + (result.message || "Something went wrong"));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Request failed. Please try again later.");
    }
  };

  document.title = editMode
    ? "Edit Flag | React Admin Dashboard"
    : "Add Flag | React Admin Dashboard";

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs title="Flags" breadcrumbItem={editMode ? "Edit Flag" : "Add Flag"} />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4">{editMode ? "Edit Flag" : "Flag Form"}</CardTitle>
                <Form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <Label htmlFor="flag_name">Flag Name</Label>
                    <Input
                      type="text"
                      id="flag_name"
                      value={formData.flag_name || ""}
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
  );
};

export default AddFlag;
