import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { BsListCheck } from 'react-icons/bs';
import { FaUsers, FaClipboardList } from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useGlobal } from '../context/ContextHolder';
import DashboardLoader from '../components/Loaders/DashboardLoader';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

const Dashboard = () => {
    const { loading } = useGlobal()
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData= async()=>{
            axios.get('http://localhost:4000/api/admin/getAnalytics', { withCredentials:true })
            .then((res)=>{
                setData(res.data.dashboardData)
            }).catch((err)=>toast.error(err.response.data.message))
        }
        fetchData()
    }, [])
 
    const chartData = useMemo(() => {
      const allMonths = data? Array.from(
        new Set([
          ...data.requestsByMonth.map((item) => item.month),
          ...data.servicesByMonth.map((item) => item.month),
        ])
      ): null
    
      const getRequestData = (month) => {
        const request = data?.requestsByMonth.find((item) => item.month === month);
        return request ? request.total : 0;
      };
  
      const getServiceData = (month) => {
        const service = data?.servicesByMonth.find((item) => item.month === month);
        return service ? service.total : 0;
      };

      return {
        labels: allMonths || '',
        datasets: [
          {
            label: 'Requests',
            data: allMonths? allMonths.map((month) => getRequestData(month)) : 0,
            backgroundColor: '#facc15',
          },
          {
            label: 'Services',
            data: allMonths? allMonths.map((month) => getServiceData(month)) : 0,
            backgroundColor: '#101820',
          },
        ],
      };
    }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: 
      {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Requests and Services Overview',
      },
    },
  };

  if (loading)  return <DashboardLoader />

  return (
    <div className="p-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101820] shadow-md rounded-lg p-4 flex items-center">
          <FaUsers className="text-4xl text-[#101820] mr-4 bg-yellow-400 rounded-full p-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Total Users</h3>
            <p className="text-2xl font-bold text-white/85">{data?.totals?.users}</p>
          </div>
        </div>
        <div className="bg-[#101820] shadow-md rounded-lg p-4 flex items-center">
          <FaClipboardList className="text-4xl text-[#101820] mr-4 bg-yellow-400 rounded-full p-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Totals Requests</h3>
            <p className="text-2xl font-bold text-white/85">{data?.totals?.requests}</p>
          </div>
        </div>
        <div className="bg-[#101820] shadow-md rounded-lg p-4 flex items-center">
          <FaClipboardList className="text-4xl text-[#101820] bg-yellow-400 mr-4 p-1 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Pending Requests</h3>
            <p className="text-2xl font-bold text-white/85">{data?.totals?.pendingRequests}</p>
          </div>
        </div>
        <div className="bg-[#101820] shadow-md rounded-lg p-4 flex items-center">
          <BsListCheck className="text-4xl text-[#101820] mr-4 bg-yellow-400 p-1 rounded-full" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-400">Total Services</h3>
            <p className="text-2xl font-bold text-white/85">{data?.totals?.services}</p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-8 bg-whit shadow-md rounded-lg p-4 w-full">
        <Bar data={chartData} options={chartOptions} height={'100%'} />
      </div>

      {/* Services Details */}
      <div className="mt-8 text-[#101820]">
        <h2 className="text-2xl font-bold mb-4">Services Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.servicesByCategory.map((item, key)=>
              <div key={key} className="bg-[#101820] shadow-md rounded-lg overflow-hidden pb-2 space-y-1">
                <h3 className="font-semibold text-lg bg-yellow-400 text-[#101820] px-3 py-2">{item.category}</h3>
                <div className='w-full flex justify-between items-center px-4'>
                  <p className='text-white/80'>Total Subcategories: </p>
                  <span className='text-white'>{item.totalSubcategories}</span>
                </div>
                <div className='w-full flex justify-between items-center px-4'>
                  <p className='text-white/80'>Posted Services: </p>
                  <span className='text-white'>{item.totalPostedServices}</span>
                </div>
                <div className='w-full flex justify-between items-center px-4'>
                  <p className='text-white/80'>Active Services: </p>
                  <span className='text-white'>{item.activeServices}</span>
                </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
