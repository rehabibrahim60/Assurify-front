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
import DashboardQm from "../pages/Dashboard_Qm/index";

//Tables
import Flags from "../pages/Tables/Flags"
import TutorFlags from "../pages/Tables/TutorFlags"
import Reports from "../pages/Tables/Reports"
import Sessions from "../pages/Tables/Sessions"
import Tutors from "../pages/Tables/Tutors"
import Users from "../pages/Tables/Users"
import AssignedSessions from "../pages/Tables/AssignedSessions";
import QmFlags from "../pages/Tables/QmFlags";
import Pdfs from "../pages/Tables/Pdfs";
import Courses from "../pages/Tables/Courses";
import QmCourses from "../pages/Tables/QmCourses";


// Forms

import AddFlag from "../pages/Forms/AddFlag";
import AddQm from "../pages/Forms/AddQm";
import AddReport from "../pages/Forms/AddReport";
import AddSession from "../pages/Forms/AddSession";
import AddTutor from "../pages/Forms/AddTutor";
import AddTutorFlag from "../pages/Forms/AddTutorFlag";
import AddCourse from "../pages/Forms/AddCourse";
import AddPdf from "../pages/Forms/AddPdf";


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
  { path: "/admin/pdf", component: < Pdfs/> },
  { path: "/admin/course", component: < Courses/> },

  // Forms
  { path: "/admin/addSession", component: <AddSession /> },
  { path: "/admin/addFlag", component: <AddFlag /> },
  { path: "/admin/addQm", component: <AddQm /> },
  { path: "/admin/addTutor", component: <AddTutor /> },
  { path: "/admin/addReport", component: <AddReport /> },
  { path: "/admin/addTutorFlag", component: <AddTutorFlag /> },
  { path: "/admin/addCourse", component: <AddCourse /> },
  { path: "/admin/addPdf", component: <AddPdf /> },


  //my pages
  { path: "/admin/video", component: <UiVideo /> },
  { path: "/admin/report-temp", component: <ReportTemp /> },





];

const qmRoutes = [
  { path: "/qm", component: <DashboardQm /> }, // Default QM route
  { path: "/qm/profile", component: <UserProfile /> }, // profile

    // Tables
    { path: "/qm/flag", component: <QmFlags /> },
    { path: "/qm/report", component: <Reports /> },
    { path: "/qm/session", component: <Sessions /> },
    { path: "/qm/assignedSession", component: <AssignedSessions /> },
    { path: "/qm/tutorFlag", component: <TutorFlags /> },
    { path: "/qm/pdf", component: <Pdfs /> },
    { path: "/qm/course", component: <QmCourses /> },

  
    // Forms,
    { path: "/qm/addSession", component: <AddSession /> },
    { path: "/qm/addFlag", component: <AddFlag /> },
    { path: "/qm/addQm", component: <AddQm /> },
    { path: "/qm/addTutor", component: <AddTutor /> },
    { path: "/qm/addReport", component: <AddReport /> },
    { path: "/qm/addTutorFlag", component: <AddTutorFlag /> },
    { path: "/qm/addPdf", component: <AddPdf /> },
  
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

  { path: "/report-temp", component: <ReportTemp /> },

];



export { authRoutes ,adminRoutes , qmRoutes };
