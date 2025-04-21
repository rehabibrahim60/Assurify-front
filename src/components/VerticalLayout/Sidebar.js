import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "components/Common/withRouter";
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";
import QmSidebarContent from "./QmSidebarConent";
import { useLocation } from "react-router-dom";

const Sidebar = (props) => {
  const location = useLocation();
  const isQmRoute = location.pathname.startsWith("/qm");

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div data-simplebar className="h-100">
          {isQmRoute ? <QmSidebarContent /> : <SidebarContent />}
        </div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStatetoProps, {})(withRouter(withTranslation()(Sidebar)));
