import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "../../context/ContextHolder";
import RequestCard from "./RequestCard";
import MyRequestsLoader from "../Loaders/MyRequestsLoader";
import Dialog from "../layout/Dialog";
import { useTranslation } from "react-i18next";
import RateDialog from "../layout/RateDialog";
import FormSubmitLoader from "../Loaders/FormSubmitLoader";
import UrduFont from "../utills/UrduFont";

const MyRequests = () => {

  const { role } = useGlobal()
  const { t } = useTranslation()
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState();
  const [deleting, setDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState();
  const [statusData, setStatusData] = useState({id:'',status:''});

  const dialogData = useMemo(() => ({
      type: statusData.status,
      message: t(statusData.status === 'delete'? 'dialog.delete' : statusData.status === 'accepted'? 'dialog.accept': statusData.status === 'rejected'? 'dialog.reject': statusData.status === 'completed'&&'dialog.complete'),
    }), [statusData.status, t])

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://labourease-production.up.railway.app/api/request/getAll", { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      setRequests(response.data.data)
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally { setLoading(false) }
  }, [])
    
  useEffect(() => {
  // Fetch client requests on page load
  fetchRequests();
  }, [fetchRequests]);
  
  
  const closeDialog = useCallback(() => {
    setIsOpen((prev)=> {
      prev === 'confirm'? 'rate' : null
    })
  }, [])
  
  // Delete a request
  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true)
      const res = await axios.delete(`https://labourease-production.up.railway.app/api/request/delete/${statusData.id}`,{ withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      toast.success(res.data.message);
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== statusData.id))
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally { closeDialog(); setDeleting(false) }
  }, [statusData.id, closeDialog])
  
  // Accept or Reject a request
  const handleRequestStatus = useCallback(async () => {
    try {
      const res = await axios.patch(`https://labourease-production.up.railway.app/api/request/updateStatus/${statusData.id}`, { status: statusData.status }, { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      statusData.status != 'completed' && toast.success(res.data.message)
      fetchRequests()
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally { closeDialog() }
  }, [statusData, fetchRequests, closeDialog])

  const openDialog = useCallback((id,status) => { 
      setIsOpen('confirm')
      setStatusData({id,status})
  }, [])

  const openRateDialog = useCallback(() => setIsOpen('rate'), [])

  // Ratings for worker
  const handleRatings = useCallback(async (ratings) => {
    try {
      await axios.patch(`https://labourease-production.up.railway.app/api/work/updateRatings/${statusData.id}`, { ratings }, { withCredentials: true, headers: {Authorization: `Bearer ${localStorage.getItem('token')}`} })
      handleRequestStatus()
      toast.success('payment released succesfully')
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally { closeDialog() }
  }, [statusData.id, closeDialog, handleRequestStatus])
  
  return (
    <div className={role==='client'? 'mt-20 p-6':''}>
      {deleting && <FormSubmitLoader text={'Deleting'} />}
      {isOpen==='rate' && <RateDialog onClose={closeDialog} onSubmit={handleRatings} />}
      {isOpen==='confirm' && <Dialog {...dialogData} onCancel={closeDialog} onConfirm={statusData.status ==='delete'? handleDelete : statusData.status==='completed'? openRateDialog : handleRequestStatus }  />}
      <h1 className='text-4xl sm:text-5xl text-yellow-500 mb-6'>
        {role === 'client'?
          <><span className='text-black'><UrduFont>{t('myRequests.clientTitleP1')}</UrduFont></span> <UrduFont>{t('myRequests.clientTitleP2')}</UrduFont></>
          :
          <><span className='text-black'><UrduFont>{t('myRequests.workerTitleP1')}</UrduFont></span> <UrduFont>{t('myRequests.workerTitleP2')}</UrduFont></>
        }
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {loading?
          Array(2).fill(0).map((_,i)=> <MyRequestsLoader key={i} />)
          :
          requests.map((request) => (
            <RequestCard key={request._id} role={role} request={request} handleAlert={openDialog} />
          ))
        }
      </div>
      {requests.length === 0 && (
        <p className="text-gray-500 text-center mt-4 text-xl">{t('myRequests.noRequest')}</p>
      )}
    </div>
  );
};

export default MyRequests;
