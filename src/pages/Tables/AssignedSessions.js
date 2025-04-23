import React, { useMemo, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import { Input } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

const AssignedSessions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState([]);
  const [pagination, setPagination] = useState(() => {
  const savedPageIndex = sessionStorage.getItem("pageIndex");
  const savedPageSize = sessionStorage.getItem("pageSize");
  return {
    pageIndex: savedPageIndex ? parseInt(savedPageIndex) : 0,
    pageSize: savedPageSize ? parseInt(savedPageSize) : 10,
  };
});


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const qmId = decodedToken._id;

    axios
      .get(`http://localhost:3005/session/qm/${qmId}`, {
        headers: { token },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        if (data.success) {
          const formattedData = data.sessions.map((session) => ({
            id: session._id,
            title: session.title,
            tutorId: session.tutor_id?.id_by_organization || "N/A",
            assignedTo: session.assigned_to?.name || "N/A",
            grade: session.grade,
            lesson: session.lesson,
            date: session.date?.split("T")[0] || "N/A",
            pdfLink: session.pdf_id?.url || "No PDF",
            videoLink: session.video?.url || "No Video",
            status: session.status,
          }));
          setSessionData(formattedData);
        } else {
          console.error("Unexpected API response:", data);
        }
      })
      .catch((err) => console.error("Axios error:", err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const token = localStorage.getItem("token");
  
    setSessionData((prevData) =>
      prevData.map((session) =>
        session.id === id ? { ...session, status: newStatus } : session
      )
    );
  
    axios
      .patch(
        `http://localhost:3005/session/${id}/status`,
        { status: newStatus },
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          console.log("Status updated");
          toast.success("status updated successfully")
        } else {
          console.error("Failed to update status:", res.data);
          toast.error("Failed to update status:", res.data);
        }
      })
      .catch((err) => {
        console.error("Axios error while updating status:", err);
        toast.error("Axios error while updating status:", err);
      });
  };
  
  const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";

  const columns = useMemo(
    
    () => [
      {
        header: "ID",
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          const rowIndex = row.index + 1 + pageIndex * pageSize;
          return <span>{rowIndex}</span>;
        },
        enableSorting: false,
      },
      { header: "Title", accessorKey: "title", enableSorting: true },
      {
        header: "Tutor ID",
        cell: ({ row }) => row.original.tutorId || "N/A",
      },
      { header: "Grade", accessorKey: "grade", enableSorting: true },
      { header: "Lesson", accessorKey: "lesson", enableSorting: true },
      { header: "Date", accessorKey: "date", enableSorting: true },
      // {
      //   header: "PDF Link",
      //   cell: ({ row }) =>
      //     row.original.pdfLink !== "No PDF" ? (
      //       <a href={row.original.pdfLink} target="_blank" rel="noopener noreferrer">
      //         View PDF
      //       </a>
      //     ) : (
      //       "No PDF Available"
      //     ),
      // },
      {
        header: "Video Link",
        accessorKey: "video.url",
        cell: ({ row }) => {
          const sessionId = row.original.id;
          
  
          return row.original.videoLink ? (
            <button
              className="btn btn-sm btn-info"
              onClick={() => navigate(`${basePath}/video?id=${sessionId}`)}
            >
              Watch Video
            </button>
          ) : (
            "No Video Available"
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <Input
            type="select"
            value={row.original.status}
            onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </Input>
        ),
      },
    ],
    []
  );

  document.title = "Assigned Sessions | React Admin Template";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Your Sessions" breadcrumbItem="Assigned Sessions" />
        <TableContainer
          columns={columns}
          data={sessionData}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search Sessions..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </div>
  );
};

export default AssignedSessions;
