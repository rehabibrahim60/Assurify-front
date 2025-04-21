import React, { Children } from "react";

// Profile
import UserProfile from "../pages/Authentication/user-profile";


// Authentication related pages
import Login from "../pages/Authentication/Login";
// import Logout from "../pages/Authentication/Logout";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";

//tutor data
import TutorData from "../pages/AuthenticationInner/TutorData";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

//Tables
import Flags from "../pages/Tables/Flags"
import TutorFlags from "../pages/Tables/TutorFlags"
import Reports from "../pages/Tables/Reports"
import Sessions from "../pages/Tables/Sessions"
import Tutors from "../pages/Tables/Tutors"
import Users from "../pages/Tables/Users"
import AssignedSessions from "../pages/Tables/AssignedSessions";
import QmFlags from "../pages/Tables/QmFlags";


// Forms

import AddFlag from "../pages/Forms/AddFlag";
import AddQm from "../pages/Forms/AddQm";
import AddReport from "../pages/Forms/AddReport";
import AddSession from "../pages/Forms/AddSession";
import AddTutor from "../pages/Forms/AddTutor";
import AddTutorFlag from "../pages/Forms/AddTutorFlag";


//Pages


import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import PagesProfile from "pages/Utility/pages-profile";


//ui
import UiVideo from "../pages/Ui/UiVideo";
import ReportTemp from "../pages/Ui/ReportTemp";

const adminRoutes = [
  { path: "/admin", component: <Dashboard /> },

  // Tables
  { path: "/admin/flag", component: <Flags /> },
  { path: "/admin/report", component: <Reports /> },
  { path: "/admin/session", component: <Sessions /> },
  { path: "/admin/tutor", component: <Tutors /> },
  { path: "/admin/tutorFlag", component: <TutorFlags /> },
  { path: "/admin/user", component: < Users/> },

  // Forms
  { path: "/admin/addSession", component: <AddSession /> },
  { path: "/admin/addFlag", component: <AddFlag /> },
  { path: "/admin/addQm", component: <AddQm /> },
  { path: "/admin/addTutor", component: <AddTutor /> },
  { path: "/admin/addReport", component: <AddReport /> },
  { path: "/admin/addTutorFlag", component: <AddTutorFlag /> },


  //my pages
  { path: "/admin/video", component: <UiVideo /> },
  { path: "/admin/report-temp", component: <ReportTemp /> },





];

const qmRoutes = [
  { path: "/qm", component: <UserProfile /> }, // Default QM route

    // Tables
    { path: "/qm/flag", component: <QmFlags /> },
    { path: "/qm/report", component: <Reports /> },
    { path: "/qm/session", component: <Sessions /> },
    { path: "/qm/assignedSession", component: <AssignedSessions /> },
    { path: "/qm/tutorFlag", component: <TutorFlags /> },

  
    // Forms,
    { path: "/qm/addSession", component: <AddSession /> },
    { path: "/qm/addFlag", component: <AddFlag /> },
    { path: "/qm/addQm", component: <AddQm /> },
    { path: "/qm/addTutor", component: <AddTutor /> },
    { path: "/qm/addReport", component: <AddReport /> },
    { path: "/qm/addTutorFlag", component: <AddTutorFlag /> },
  
    //my pages
    { path: "/qm/video", component: <UiVideo /> },
    { path: "/qm/report-temp", component: <ReportTemp /> },
  
];

const authRoutes = [
  

  { path: "/", component: <Login /> },
  // { path: "/logout", component: <Logout /> },

  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },

  // Authentication Inner

  { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/tutor-data", component: <TutorData /> },

];



export { authRoutes ,adminRoutes , qmRoutes };
