import axios from "axios";
import { useState, useMemo, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useTable, useSortBy, usePagination } from "react-table";
import { useGlobal } from "../context/ContextHolder";
import ManagementLoader from "../components/Loaders/ManagementLoader";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const { loading } = useGlobal()
  const navigateTo = useNavigate()
    const [filter, setFilter] = useState({ role: "", status: "", search: "" });
    const [users, setUsers] = useState([])
    
    const fetchData= useCallback(async ()=>{
        await axios.get('http://localhost:4000/api/admin/getAllUsers', { withCredentials:true })
        .then((res)=>{
            setUsers(res.data.users || [])
        }).catch((err)=>toast.error(err.response.data.message))
    }, [])

    useEffect(() => {
      fetchData()
    }, [fetchData])

  const filteredUsers = useMemo(()=> {
    return users.filter((user)=>{
      const matchesRole = filter.role? user.role === filter.role : true
      const matchesStatus = filter.status? user.status === filter.status : true
      const matchesSearch = filter.search? 
          user.name.toLowerCase().includes(filter.search.toLowerCase()) || 
          user.cnic.toString().includes(filter.search.toLowerCase()) : true
      return matchesRole && matchesStatus && matchesSearch
    })
  }, [filter.role, filter.search, filter.status, users])
  
  const handleStatus = useCallback(async(user) => {
    const status = user.status === 'active'? 'banned' : 'active'
    await axios.patch(`http://localhost:4000/api/admin/updateStatus/${user._id}`, { status }, { withCredentials:true })
    .then((res)=>{
      toast.success(res.data.message)
      fetchData()
    })
    .catch((err)=>toast.error(err.response.data.message))
  }, [fetchData])

  const handleDelete = useCallback(async(user) => {
    await axios.delete(`http://localhost:4000/api/admin/deleteUser/${user._id}`, { withCredentials:true })
    .then((res)=>{
      toast.success(res.data.message)
      fetchData()
    })
    .catch((err)=>toast.error(err.response.data.message))
  }, [fetchData])
    
  const handleView = useCallback((user) => {
    navigateTo('detials/'+user._id)    
  }, [navigateTo])

    const columns = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "CNIC", accessor: "cnic" },
      { Header: "Role", accessor: "role" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleView(row.original)}>
              View
            </button>
            <button className='px-2 py-1 text-sm1 text-white rounded bg-yellow-600 hover:bg-yellow-500'
              onClick={() => handleStatus(row.original)}>
              {row.original.status==='active'? 'inActive':'active'}
            </button>
            <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDelete(row.original)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    [handleDelete, handleView, handleStatus]
  );

  const data = useMemo(() => filteredUsers, [filteredUsers]);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage,
           canNextPage, pageOptions, nextPage, previousPage, setPageSize,
           state: { pageIndex, pageSize },
        } = useTable( { columns, data, initialState: { pageIndex: 0 } }, useSortBy, usePagination );


  const handleFilterChange = useCallback((e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  }, [filter])
  
  if (loading) return <ManagementLoader />

  return (
    <div className="p-4">
      <div className="w-full flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold mb-4 text-[#101820]">User Management</h1>
        <Link to={'new'} className='bg-[#101820] text-white px-4 py-2 rounded-md shadow-md'>
          + New User
        </Link>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="bg-[#101820] rounded-md p-2 text-gray-400"
            placeholder="Search by name or cnic"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
          />
          <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="role"
            value={filter.role}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="worker">Worker</option>
            <option value="client">client</option>
          </select>
          <select className="bg-[#101820] rounded-md p-2 text-gray-400"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto" style={{scrollbarWidth:'thin', scrollbarColor:'#facc15 #101820'}}>
        <table 
          role={getTableProps().role}
          className="table-auto w-full shadow-sm"
        >
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key} role={headerGroup.getHeaderGroupProps().role}>
                {headerGroup.headers.map((column) => (
                    <th key={column.getHeaderProps(column.getSortByToggleProps()).key} 
                        colSpan={column.getHeaderProps(column.getSortByToggleProps()).colSpan}
                        role={column.getHeaderProps(column.getSortByToggleProps()).role}
                        style={{...column.getHeaderProps(column.getSortByToggleProps()).style}}
                        title={column.getHeaderProps(column.getSortByToggleProps()).title}
                        onClick={column.getHeaderProps(column.getSortByToggleProps()).onClick}
                        className="px-4 py-3 text-left text-yellow-400 font-medium bg-[#101820] border-b-2"
                    >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " ▼"
                          : " ▲"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-[#101820]">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.getRowProps().key}
                  role={row.getRowProps().role}
                  className="border-t hover:bg-slate-800"
                >
                  {row.cells.map((cell) => (
                    <td key={cell.getCellProps().key} role={cell.getCellProps().role}
                      className="px-4 py-2 text-white/70"
                    >
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

export default UserManagement;
