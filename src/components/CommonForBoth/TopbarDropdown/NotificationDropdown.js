import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import {jwtDecode} from "jwt-decode";
import SimpleBar from "simplebar-react";
import axios from "axios";

// i18n
import { withTranslation } from "react-i18next";

const NotificationDropdown = (props) => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);


  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded)
      const userId = decoded._id; // Make sure this matches the key in your token

      axios.get(`http://localhost:3005/notification/user/${userId}`, {
        headers: {
          token,
        }
      })
        .then((response) => {
         console.log(response.data.notifications);
          setNotifications(response.data.notifications);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
}, []);

const handleToggle = async () => {
  const nextMenuState = !menu;
  setMenu(nextMenuState);

  // If closing the dropdown, then mark as read
  if (!nextMenuState) {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded._id;

        await axios.patch(
          `http://localhost:3005/notification/${userId}`,
          {},
          { headers: { token } }
        );

        setNotifications((prev) =>
          prev.map(n => ({ ...n, isRead: true }))
        );
      } catch (error) {
        console.error("Failed to mark notifications as read", error);
      }
    }
  }
};




  const displayedNotifications = showAll
    ? notifications
    : notifications.filter(n => !n.isRead);


  return (
    <Dropdown
      isOpen={menu}
      toggle={handleToggle}
      className="dropdown d-inline-block"
      tag="li"
    >
      <DropdownToggle
        className="btn header-item noti-icon waves-effect"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <i className="mdi mdi-bell-outline"></i>
        {notifications.filter(n => !n.isRead).length > 0 && (
          <span className="badge bg-danger rounded-pill">
            {notifications.filter(n => !n.isRead).length}
          </span>
        )}
      </DropdownToggle>


      <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0 font-size-16">
                {props.t("Notifications")} ({notifications.length})
              </h6>
            </Col>
          </Row>
        </div>

        <SimpleBar style={{ height: "230px" }}>
          {displayedNotifications.length >0 ? displayedNotifications.map((notification, index) => (
            <Link to="#" className="text-reset notification-item" key={index}>
              <div className="d-flex">
                <div className="avatar-xs me-3">
                  <span className={`avatar-title bg-${notification.color || "primary"} rounded-circle font-size-16`}>
                    <i className={`mdi ${notification.icon || "mdi-bell-outline"}`}></i>
                  </span>
                </div>
                <div className="flex-1">
                  <h6 className="mt-0 mb-1">New session</h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            </Link>
          )) : ""}
        </SimpleBar>

        <div className="p-2 border-top d-grid">
          <Link
            className="btn btn-sm btn-link font-size-14 btn-block text-center"
            to="#"
            onClick={() => setShowAll(true)}
          >
            <i className="mdi mdi-arrow-right-circle me-1"></i>
            {props.t("View all")}
          </Link>

        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

NotificationDropdown.propTypes = {
  t: PropTypes.any
};

export default withTranslation()(NotificationDropdown);
