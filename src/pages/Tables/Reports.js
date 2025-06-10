import React, { useMemo, useEffect, useState  } from "react";
import { Button } from "reactstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";
import axios from "axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const Reports = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith("/qm") ? "/qm" : "/admin";

  const [reportData, setReportData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    axios
      .get("http://localhost:3005/report", {
        headers: { token },
      })
      .then((res) => {
        if (res.data.success) {
          setReportData(res.data.reports); // assuming your API returns `reports` array
        } else {
          console.error("Failed to fetch reports:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
      });
  }, []);
  

  const handleEdit = (id) => {
    navigate(`${basePath}/video?id=${id}`);
  };

  const handleDelete = (id) => {
    setSelectedReportId(id);
    setShowConfirmModal(true);
  };
  
  const confirmDelete = () => {
    const token = localStorage.getItem("token");
  
    axios
      .delete(`http://localhost:3005/report/${selectedReportId}`, {
        headers: { token },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("report deleted successfully")
          setReportData((prev) => prev.filter((r) => r._id !== selectedReportId));
        } else {
          console.error("Failed to delete report:", res.data.message);
          toast.error("Failed to delete report:", res.data.message);
        }
      })
      .catch((err) => {
        console.error("Error deleting report:", err);
        toast.error("Error deleting report:", err);
      })
      .finally(() => {
        setShowConfirmModal(false);
        setSelectedReportId(null);
      });
  };
  


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
      { header: "Session ID", accessorKey: "session_id" },
      { header: "Similarity", accessorKey: "similarity" },
      {
        header: "Bad Words",
        cell: ({ row }) =>
          
          row.original.bad_word.length
            ? row.original.bad_word.map((bw, i) => (
                <div key={i}>{bw.word}</div>
              ))
            : "None",
      },
      { header: "Noisy Detection", accessorKey: "noisy_detection" },
      // { header: "Key Points", accessorKey: "key_points" },
      // { header: "Summary", accessorKey: "summary" },
      {
        header: "Abnormal Times",
        cell: ({ row }) =>
          row.original.abnormal_times.length
            ? row.original.abnormal_times.map((t, i) => (
                <div key={i}>
                  {t.start_time} - {t.end_time}
                </div>
              ))
            : "None",
      },
      {
        header: "Time Tracking",
        cell: ({ row }) =>
          row.original.time_tracking.length
            ? row.original.time_tracking.map((t, i) => (
                <div key={i}>
                  {t.start_frame} - {t.end_frame}
                </div>
              ))
            : "None",
      },
      { header: "Total Silence Duration", accessorKey: "total_silence_duration" },
      {
        header: "Tutor View",
        cell: ({ row }) => (
          <Link
            to={`${basePath}/report-temp?id=${row.original._id}`}
            className="btn btn-info btn-sm"
          >
            View
          </Link>
        ),
      },

      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <>
            <Button
              color="primary"
              size="sm"
              className="me-2"
              onClick={() => handleEdit(row.original.session_id)}
            >
              Edit
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
            >
              Delete
            </Button>
          </>
        ),
      },
    ],
    [navigate, basePath]
  );
  

  const data = reportData

  document.title = "Data Tables | Skote - React Admin & Dashboard Template";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Reports" breadcrumbItem="All Reports" />
        <TableContainer
          columns={columns}
          data={data}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search reports..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this report?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

    </div>
  );
};

export default Reports;
