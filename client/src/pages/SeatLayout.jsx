import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import Loading from '../components/Loading'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import { assets } from '../assets/assets'
import toast from "react-hot-toast"
import axios from 'axios'
import { useAuth } from '@clerk/react'

const SeatLayout = () => {

  const groupRows=[["A", "B"], ["C","D"], ["E","F"],["G","H"],["I","J"]]

  const {id,date} = useParams()
  const [selectedSeats, setSelectedSeats]= useState([])
  const [selectedTime, setSelectedTime]= useState(null)
  const [show, setShow]= useState(null)
  
  const navigate = useNavigate()
  const { getToken } = useAuth();
  
  const getShow = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}`}/api/movie/${id}`);
      if (res.data.success) {
        const { movie, shows } = res.data;
        const formattedDateTime = {};
        shows.forEach(s => {
            const dateKey = new Date(s.showDateTime).toISOString().split('T')[0];
            if (!formattedDateTime[dateKey]) {
                formattedDateTime[dateKey] = [];
            }
            formattedDateTime[dateKey].push({
                time: s.showDateTime,
                showId: s._id,
                showPrice: s.showPrice,
                occupiedSeats: Object.keys(s.occupiedSeats || {})
            });
        });

        setShow({
          movie,
          dateTime: formattedDateTime
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handSeatClick = (seatId) => {
    if(!selectedTime){
      return toast.error("Please select time first")
    }
    if (selectedTime.occupiedSeats.includes(seatId)) {
        return toast.error("Seat is already booked");
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length >= 5){
      return toast.error("You can only select up to 5 seats")
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }
  
  const initPayment = (data, key_id, token, bookingDetails) => {
      if (!window.Razorpay) {
          toast.error("Razorpay SDK failed to load. Please disable adblockers or check your connection.");
          return;
      }
      
      const options = {
          key: key_id,
          amount: data.amount,
          currency: data.currency,
          name: "Cinebook",
          description: "Movie Ticket Booking",
          order_id: data.id,
          handler: async (response) => {
              try {
                  const verifyRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}`}/api/booking/verify-razorpay-payment`, {
                      ...response,
                      bookingDetails
                  }, { headers: { Authorization: `Bearer ${token}` } });

                  if (verifyRes.data.success) {
                      toast.success("Tickets Booked Successfully!");
                      navigate('/my-bookings');
                  } else {
                      toast.error("Payment verification failed");
                  }
              } catch (error) {
                  console.error(error);
                  toast.error("Verification Error");
              }
          },
          theme: {
              color: "#3399cc"
          }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
  };

  const handleBooking = async () => {
      if (!selectedTime) return toast.error("Please select a show time.");
      if (selectedSeats.length === 0) return toast.error("Please select at least one seat.");

      try {
          const token = await getToken();
          if (!token) return toast.error("Please log in to book tickets.");

          const totalAmount = selectedSeats.length * selectedTime.showPrice;
          
          const bookingDetails = {
              movieId: id,
              showId: selectedTime.showId,
              seats: selectedSeats,
              totalAmount
          };

          // Create Razorpay Order
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL || `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}`}/api/booking/create-razorpay-order`, {
              amount: totalAmount
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          if (res.data.success) {
              initPayment(res.data.order, res.data.key_id, token, bookingDetails);
          } else {
              toast.error(res.data.message || "Failed to initiate payment.");
          }
      } catch (error) {
          console.error("Booking catch error:", error.response?.data || error);
          toast.error(error.response?.data?.message || error.message || "Error booking tickets.");
      }
  };

  const renderSeats = (row, count = 9) => (
   <div key={row} className="flex gap-1 mt-1">
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Array.from({length:count},(_,i)=>{
        const seatId = `${row}${i+1}`;
        const isOccupied = Array.isArray(selectedTime?.occupiedSeats) 
                           ? selectedTime?.occupiedSeats?.includes(seatId) 
                           : selectedTime?.occupiedSeats?.[seatId];
        const isSelected = selectedSeats.includes(seatId);

        let seatClass = "border border-primary/60 cursor-pointer";
        if (isOccupied) seatClass = "bg-gray-600 cursor-not-allowed";
        else if (isSelected) seatClass = "bg-primary text-white";

        return(
          <button key={seatId} onClick={() => !isOccupied && handSeatClick(seatId)} className={`h-5 w-5 text-[8px] rounded ${seatClass}`}>
            {seatId}
          </button>
        );
      })}
    </div>
   </div>
  )

  useEffect(()=>{
    getShow()
  },[id])

  return show && show.dateTime && show.dateTime[date] ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/*Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
      <p className='text-lg font-semibold px-0'>Available Timings</p>
      <div className='mt-5 space-y-1'>
        {show.dateTime[date].map((items,index)=>(
          <div 
          key={index}
          onClick={()=> {
              setSelectedTime(items);
              setSelectedSeats([]); // reset seats on time change
          }}
          className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time === items.time ? "bg-primary text-white":"hover:bg-primary/20"}`}>
            <ClockIcon className='w-4 h-4'/>
            <p className='text-sm'>{isoTimeFormat(items.time)}</p>
            </div>
        ))}
      </div>
      </div>
      {/*Seat Layout*/}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px"/>
        <BlurCircle bottom="0" right="0"/>
        <h1 className='text-2xl font-semibold mb-4'>Select your Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row=> renderSeats(row))}
          </div>

        </div>

        <div className='grid grid-cols-2 gap-11'>
          {groupRows.slice(1).map((group,idx)=>(
            <div key={idx}>
              {group.map(row=> renderSeats(row))}
              </div>
          ))}
          
        </div>
        <button onClick={handleBooking} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
        </button>
      </div>
    </div>
  ) : (
    <Loading/>
  )
}

export default SeatLayout
