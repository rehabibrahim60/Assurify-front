import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/DataTableContainer";

const QmCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3005/course", {
        headers: { token },
      })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (data.success) {
          setCourses(data.courses);
        } else {
          toast.error("Error fetching courses.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch courses.");
      });
  }, []);

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
      {
        header: "Course Name",
        accessorKey: "title",
      },
      {
        header: "Number of Lessons",
        accessorKey: "num_of_lessons",
      },
    ],
    []
  );

  document.title = "Courses | Data Table - React Admin Dashboard";

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Courses" breadcrumbItem="Courses" />

        <TableContainer
          columns={columns}
          data={courses}
          isGlobalFilter={true}
          isPagination={true}
          SearchPlaceholder="Search Courses..."
          pagination="pagination"
          paginationWrapper="dataTables_paginate paging_simple_numbers"
          tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        />
      </div>
    </div>
  );
};

export default QmCourses;
