import axios from "axios";
import { useState, useMemo, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useTable, usePagination, useSortBy } from "react-table";
import ManagementLoader from "../components/Loaders/ManagementLoader";
import { useGlobal } from "../context/ContextHolder";
import { useNavigate } from "react-router-dom";

const RequestManagement = () => {
  const { loading } = useGlobal()
  const navigateTo = useNavigate()
  const [requests, setRequests] = useState([])
  const [filter, setFilter] = useState({ status: "", search: "" });

  const fetchData= useCallback(async ()=>{
    await axios.get('http://localhost:4000/api/admin/getAllRequests', { withCredentials:true })
    .then((res)=>{
        setRequests(res.data.allRequests || [])
    }).catch((err)=>toast.error(err.response.data.message))
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredRequests = useMemo(()=> {
    return requests.filter((request)=>{
      const matchesStatus = filter.status? request.status === filter.status : true
      const matchesSearch = filter.search? 
          request.name.toLowerCase().includes(filter.search.toLowerCase()) || 
          request.contact.toString().includes(filter.search.toLowerCase()) : true
      return matchesStatus && matchesSearch
    })
  }, [filter.search, filter.status, requests])

  const handleDelete = useCallback(async (request) => {
    await axios.delete(`http://localhost:4000/api/admin/deleteRequest/${request._id}`, { withCredentials:true })
    .then((res)=>{
      toast.success(res.data.message)
      fetchData()
    })
    .catch((err)=>toast.error(err.response.data.message))
  }, [fetchData])
  
  const handleView = useCallback((request) => {
    navigateTo('detials/'+request._id)    
  }, [navigateTo])
  
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Number", accessor: "contact" },
      { Header: "For_service", accessor: "workId" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600" 
                onClick={() => handleView(row.original)}>
              View
            </button>
            <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600" 
                onClick={() => handleDelete(row.original)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleView]
  );

  const {
    getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage,
    canNextPage, pageOptions, nextPage, previousPage, setPageSize, state: { pageIndex, pageSize },
  } = useTable( { columns, data: filteredRequests, initialState: { pageIndex: 0 }, }, useSortBy, usePagination);


  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  if (loading) return <ManagementLoader />

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Request Management</h1>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="bg-[#101820] rounded-md p-2 text-gray-400"
            placeholder="Search by name and number"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
          />
          {/* <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="name"
            value={filter.name}
            onChange={handleFilterChange}
          >
            <option value="">All Names</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
          </select> */}
          <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" style={{scrollbarWidth:'thin', scrollbarColor:'#facc15 #101820'}}>
        <table {...getTableProps()} className="table-auto w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key} role={headerGroup.getHeaderGroupProps().role}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.getHeaderProps(column.getSortByToggleProps()).key} 
                    colSpan={column.getHeaderProps(column.getSortByToggleProps()).colSpan}
                    role={column.getHeaderProps(column.getSortByToggleProps()).role}
                    style={{...column.getHeaderProps(column.getSortByToggleProps()).style}}
                    title={column.getHeaderProps(column.getSortByToggleProps()).title}
                    onClick={column.getHeaderProps(column.getSortByToggleProps()).onClick}
                    className="px-4 py-3 text-left text-yellow-400 font-medium bg-[#101820] border-b-2"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-[#101820]">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.getRowProps().key} role={row.getRowProps().role} className="border-t hover:bg-slate-800">
                  {row.cells.map((cell) => (
                    <td key={cell.getCellProps().key} role={cell.getCellProps().role} className="px-4 py-2 text-white/70">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2 text-[#101820]">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-2 sm:px-3 py-1 max-sm:text-sm bg-yellow-400 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-2 sm:px-3 py-1 max-sm:text-sm bg-yellow-400 rounded hover:bg-yellow-600 disabled:bg-yellow-400"
          >
            Next
          </button>
        </div>
        <span className="max-sm:text-sm">
          Page {pageIndex + 1} of {pageOptions.length}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border border-[#101802] rounded px-1 sm:px-2 py-1 max-sm:text-sm"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RequestManagement;
