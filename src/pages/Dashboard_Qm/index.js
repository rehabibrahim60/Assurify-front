import PropTypes from 'prop-types';
import React, { useState , useEffect} from "react";
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import { Link } from "react-router-dom";



// import images
import servicesIcon1 from "../../assets/images/services-icon/01.png";
import servicesIcon2 from "../../assets/images/services-icon/02.png";
import servicesIcon3 from "../../assets/images/services-icon/03.png";
import servicesIcon4 from "../../assets/images/services-icon/04.png";
import { jwtDecode } from 'jwt-decode';




const Dashboard = props => {
  const [menu, setMenu] = useState(false);
  const toggle = () => {
    setMenu(!menu);
  };
  const [stats, setStats] = useState(null);
  

useEffect(() => {
  const token = localStorage.getItem("token")
  const user_id = jwtDecode(token)._id
  const fetchData = async () => {
    try {
      const resStats = await axios.get(`http://localhost:3005/dashboard/${user_id}`,{headers : {token}});


      setStats(resStats.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  fetchData();
}, []);

  document.title = "Admin Dashboard";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="page-title-box">
            <Row className="align-items-center">
              <Col md={8}>
                <h6 className="page-title">Home</h6>
                <ol className="breadcrumb m-0">
                  {/* <li className="breadcrumb-item active">Welcome to Assurify Dashboard</li> */}
                </ol>
              </Col>

              <Col md="4">
                <div className="float-end d-none d-md-block">
                  
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            {stats && (
              <>
            <Col xl={5} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-start mini-stat-img me-4">
                      <img src={servicesIcon1} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">Your Assigned Sessions</h5>
                    <h4 className="fw-medium font-size-24">{stats.yourSessions}</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={5} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-start mini-stat-img me-4">
                      <img src={servicesIcon2} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">Reviewed Sessions</h5>
                    <h4 className="fw-medium font-size-24">{stats.reviewedSessions}</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={5} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-start mini-stat-img me-4">
                      <img src={servicesIcon3} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">Tutor assigned to you</h5>
                    <h4 className="fw-medium font-size-24">{stats.tutors}</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={5} md={6}>
              <Card className="mini-stat bg-primary text-white">
                <CardBody>
                  <div className="mb-4">
                    <div className="float-start mini-stat-img me-4">
                      <img src={servicesIcon4} alt="" />
                    </div>
                    <h5 className="font-size-16 text-uppercase mt-0 text-white-50">Quality</h5>
                    <h4 className="fw-medium font-size-24">{stats.quality}%</h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
              </>
            )}
          </Row>

          <Row>
            {/* <Col xl={10}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Activity</h4>
                  <ol className="activity-feed">
                    {activities && activities.map((item, idx) => (
                      <li className="feed-item" key={idx}>
                        <div className="feed-item-list">
                          <span className="date">{item.date}</span>
                          <span className="activity-text">{item.action}</span>
                        </div>
                      </li>
                    ))}
                  </ol>

                  
                </CardBody>
              </Card>
            </Col> */}

            <Col xl={5}>

            </Col>
          </Row>
          
        </Container>
      </div>

    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any
};

// export default withTranslation()(Dashboard);
export default Dashboard;
