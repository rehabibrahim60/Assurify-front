
import PropTypes from 'prop-types';
import React from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Routes
import ProtectedRoute from './routes/ProtectedRoute';
import { qmRoutes, adminRoutes, authRoutes } from "./routes/allRoutes";

// Import middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";

// Import scss
import "./assets/scss/theme.scss";

// Fake backend
import fakeBackend from "./helpers/AuthType/fakeBackend";
// fakeBackend();

const App = () => {
  const location = useLocation();
  const path = location.pathname;

  const isQmRoute = path.startsWith("/qm");
  const isAdminRoute = path.startsWith("/admin");

  return (
    <React.Fragment>
      {/* Your Routes or Layouts */}
      <ToastContainer autoClose={2000} /> {/* Auto hide after 2 seconds */}
      <Routes>
        {/* Always render authentication routes */}
        {authRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={route.component}
            key={`auth-${idx}`}
            exact
          />
        ))}

        {/* Render QM or Admin routes based on path */}
        {(isQmRoute ? qmRoutes : adminRoutes).map((route, idx) => (
          <Route
          path={route.path}
          element={
            <ProtectedRoute role={isQmRoute ? "quality_member" : "admin"}>
              <Authmiddleware>{route.component}</Authmiddleware>
            </ProtectedRoute>
          }
          key={`main-${idx}`}
          exact
        />
        
        ))}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
