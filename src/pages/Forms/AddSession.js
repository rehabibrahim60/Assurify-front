import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Row, Col, Card, CardBody, Form, Label, Input, Button,
  CardTitle, Container
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";



const AddSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("id");
  

  const [formData, setFormData] = useState({
    title: "",
    tutor: "",
    pdfOption: "select",
    video: null,
    pdf: "",
    file: null,
    pdfTitle: "",
    qm: "",
    date: "",
    grade: "",
    lesson: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [qms, setQms] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    video: "",
    file: ""
  });
  
  const token = localStorage.getItem("token");

  const decoded = token ? jwtDecode(token) : {};
  const currentUserId = decoded._id;
  const currentUserRole = decoded.role;

  useEffect(() => {
    axios.get("http://localhost:3005/tutor", { headers: { token } })
      .then(res => setTutors(res.data.tutors))
      .catch(err => console.error("Fetch tutors error:", err));
  }, []);

  
  useEffect(() => {
    if (currentUserRole === "admin") {
      axios.get("http://localhost:3005/user", { headers: { token } })
        .then(res => setQms(res.data.users))
        .catch(err => console.error("Fetch QMs error:", err));
    } else if (currentUserRole === "quality_member") {
      // just set the current user as the only option
      setFormData(prev => ({ ...prev, qm: currentUserId }));
    }
  }, [currentUserRole, currentUserId]);
  

  useEffect(() => {
    axios.get("http://localhost:3005/pdf", { headers: { token } })
      .then(res => setPdfs(res.data.pdfs))
      .catch(err => console.error("Fetch PDFs error:", err));
  }, []);

  useEffect(() => {
    if (sessionId) {
      setEditMode(true);
      axios.get(`http://localhost:3005/session/${sessionId}`, { headers: { token } })
        .then(res => {
          const session = res.data.session;
          setFormData({
            title: session.title || "",
            tutor: session.tutor_id?._id || "",
            pdfOption: session.pdf_id ? "select" : "upload",
            pdf: session.pdf_id?._id || "",
            video: null,
            qm: session.assigned_to?._id || "",
            date: session.date || "",
            grade: session.grade || "",
            lesson: session.lesson || "",
            pdfTitle: "",
            file: null
          });
        })
        .catch(err => console.error("Fetch session error:", err));
    }
  }, [sessionId]);

  const handleChange = (e, selectData = null) => {
    if (selectData) {
      // react-select value
      const { name, value } = selectData;
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };
  

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    const file = files[0];
    if (!file) return;
  
    let errorMsg = "";
  
    if (id === "file" && file.type !== "application/pdf") {
      errorMsg = "Only PDF files are allowed.";
    } else if (id === "video" && !file.type.startsWith("video/")) {
      errorMsg = "Only video files are allowed.";
    }
  
    setErrors(prev => ({ ...prev, [id]: errorMsg }));
  
    if (!errorMsg) {
      setFormData(prev => ({ ...prev, [id]: file }));
    }
  };
  

// ... الكود كما هو في الأعلى

const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // لو بيبعت بالفعل، منعملش حاجة

  setIsSubmitting(true); // قفل الزر

  const method = editMode ? "patch" : "post";
  const url = editMode
    ? `http://localhost:3005/session/${sessionId}`
    : "http://localhost:3005/session";

  const payload = new FormData();
  payload.append("title", formData.title);
  payload.append("tutor_id", formData.tutor);
  payload.append("assigned_to", formData.qm);
  payload.append("date", formData.date);
  payload.append("grade", formData.grade);
  payload.append("lesson", formData.lesson);

  let finalPdfId = formData.pdf;

  if (formData.pdfOption === "upload") {
    try {
      const pdfData = new FormData();
      pdfData.append("file", formData.file);
      pdfData.append("title", formData.pdfTitle);
      const pdfRes = await axios.post("http://localhost:3005/pdf", pdfData, {
        headers: { token },
      });

      if (pdfRes.data.success) {
        finalPdfId = pdfRes.data.pdf._id;
      } else {
        toast.error("Error uploading PDF.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("PDF Upload Error:", err);
      toast.error("Error uploading PDF.");
      setIsSubmitting(false);
      return;
    }
  }

  payload.append("pdf_id", finalPdfId);

  if (formData.video) {
    payload.append("video", formData.video);
  }

  try {
    const res = await axios({
      method,
      url,
      data: payload,
      headers: { token },
    });

    if (res.status === 200 || res.status === 201) {
      const addedSessionId = res.data.session._id;
      const analyzeData = new FormData();
      analyzeData.append("session_id", addedSessionId);
      analyzeData.append("video", formData.video);

      // Handle PDF file (upload or fetch from existing)
      if (formData.pdfOption === "upload") {
        analyzeData.append("pdf", formData.file);
      } else if (formData.pdfOption === "select" && formData.pdf) {
        try {
          console.log(formData.pdf);
          
          const pdfBlobRes = await axios.get(`http://localhost:3005/pdf/${formData.pdf}/download`, {
            responseType: "blob",
            headers: { token },
          });

          const pdfFile = new File(
            [pdfBlobRes.data],
            "selected.pdf",
            { type: "application/pdf" }
          );

          analyzeData.append("pdf", pdfFile);
        } catch (err) {
          console.error("Error fetching existing PDF as file:", err);
          toast.error("Failed to load selected PDF file.");
          setIsSubmitting(false);
          return;
        }
      }


      const reportRes = await axios.post("http://localhost:3005/report", analyzeData, {
        headers: { token },
      });

      if (reportRes.status === 200 || reportRes.status === 201) {
        toast.success(editMode ? "Session updated successfully!" : "Session added successfully!");
        const basePath = location.pathname.startsWith("/admin") ? "/admin" : "/qm";
        navigate(`${basePath}/video?id=${addedSessionId}`);
      }
    }
  } catch (err) {
    console.error("Error submitting session or report:", err);
    toast.error("Error submitting session.");
  } finally {
    setIsSubmitting(false); // رجع الزر شغال
  }
};

  const tutorOptions = tutors.map(t => ({ label: t.name, value: t._id }));

  // controlled value: find current selected tutor option
  const selectedTutor = tutorOptions.find(opt => opt.value === formData.tutor) || null;

  const pdfOptions = pdfs.map(pdf => ({ label: pdf.title, value: pdf._id }));
  const selectedPdf = pdfOptions.find(opt => opt.value === formData.pdf) || null;
  // Assuming qms is an array like: [{ _id: '1', name: 'QM Name' }, ...]
  const qmOptions = qms.map(qm => ({ label: qm.name, value: qm._id }));

  // Controlled value for selected QM
  const selectedQM = qmOptions.find(opt => opt.value === formData.qm) || null;

  document.title = editMode ? "Edit Session" : "Add Session";

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Sessions" breadcrumbItem={editMode ? "Edit Session" : "Add Session"} />
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <CardTitle className="h4">{editMode ? "Edit Session" : "Add Session"}</CardTitle>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <Label htmlFor="title">Title </Label>
                      <Input type="text" id="title" value={formData.title} onChange={handleChange} required />
                    </Col>
                    <Col lg={6}>
                      <Label htmlFor="tutor">Select Tutor</Label>
                      <Select
                        id="tutor"
                        options={tutorOptions}
                        value={selectedTutor}
                        onChange={(selected) =>
                          setFormData(prev => ({ ...prev, tutor: selected ? selected.value : "" }))
                        }
                        isClearable
                      />

                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6}>
                      <Label>PDF</Label>
                      <Input type="select" id="pdfOption" value={formData.pdfOption} onChange={handleChange} >
                        <option value="select">Select Existing PDF</option>
                        <option value="upload">Upload New PDF</option>
                      </Input>

                      {formData.pdfOption === "select" ? (
                        
                        <Select
                          id="pdf"
                          options={pdfOptions}
                          value={selectedPdf}
                          onChange={(selected) =>
                            setFormData(prev => ({ ...prev, pdf: selected ? selected.value : "" }))
                          }
                          isClearable
                        />
                      ) : (
                        <>
                          <Input
                            type="text"
                            id="pdfTitle"
                            placeholder="Enter PDF Title"
                            value={formData.pdfTitle}
                            onChange={handleChange}
                            className="mt-2"
                            required
                          />
                          <Input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className="mt-2"
                            accept="application/pdf"
                            required
                          />
                          {errors.file && <small className="text-danger">{errors.file}</small>}
                        </>
                      )}
                    </Col>
                    <Col lg={6}>
                      <Label>Upload Video</Label>
                      <Input
                        type="file"
                        id="video"
                        onChange={handleFileChange}
                        accept="video/*"
                        required
                      />
                      {errors.video && <small className="text-danger">{errors.video}</small>}
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6}>
                      <Label htmlFor="qm">Quality Member</Label>
                      {currentUserRole === "admin" ? (
                        <Select
                          id="qm"
                          options={qmOptions}
                          value={selectedQM}
                          onChange={(selected) =>
                            setFormData(prev => ({ ...prev, qm: selected ? selected.value : "" }))
                          }
                          isClearable
                        />
                      ) : (
                        <Input type="text" id="qm" value={currentUserId} disabled />
                      )}

                    </Col>
                    <Col lg={6}>
                      <Label htmlFor="date">Date</Label>
                      <Input type="date" id="date" value={formData.date} onChange={handleChange} required />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6}>
                      <Label htmlFor="grade">Grade (optional)</Label>
                      <Input type="text" id="grade" value={formData.grade} onChange={handleChange}  />
                    </Col>
                    <Col lg={6}>
                      <Label htmlFor="lesson">Lesson (optional)</Label>
                      <Input type="text" id="lesson" value={formData.lesson} onChange={handleChange}  />
                    </Col>
                  </Row>

                  <Button type="submit" color="primary" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : editMode ? "Update" : "Submit"}
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

export default AddSession;
