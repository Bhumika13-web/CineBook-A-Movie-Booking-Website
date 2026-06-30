import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'
import { dummyBookingData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'


const MyBookings = () => {
  const currency= import.meta.env.VITE_CURRENCY

  const [bookings, setBookings]=useState([])
  const [isLoading, setIsLoading]=useState(true)

  const { getToken } = useAuth();

  const getMyBookings = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}`}/api/booking/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getMyBookings();
  },[]);


  return !isLoading ?(
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
       <div>
        <BlurCircle bottom="0px" left="600px"/>
        </div>      
        <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

        {bookings.map((item,index)=>(
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
            <div className='flex flex-col md:flex-row gap-4'>
              <img src={item.movie?.backdrop_path?.startsWith('/') ? `https://image.tmdb.org/t/p/w500${item.movie.backdrop_path}` : item.movie?.backdrop_path} alt="" className='md:max-w-45 aspect-video h-auto object-cover rounded'/>
              <div className='flex flex-col py-2'>
                <p className='text-lg font-semibold'>{item.movie?.title}</p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.movie?.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show?.showDateTime)}</p>
              </div>

            </div>

            <div className='flex flex-col md:items-end justify-between p-2 md:p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>₹{item.totalAmount}</p>
                 <span className='bg-green-500/20 text-green-500 px-4 py-1.5 mb-3 text-sm rounded-full font-medium'>Paid</span>
              </div>
              <div className='text-sm flex flex-col md:items-end gap-1'>
                <p><span className='text-gray-400'>Total Tickets: </span>{item.seats.length}</p>
                <p><span className='text-gray-400'>Seat Numbers: </span>{item.seats.join(", ")}</p>
               </div>
            </div>
          </div>
        ))}


    </div>
  ):(<Loading/>);
}

export default MyBookings
