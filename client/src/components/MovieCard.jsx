import { StarIcon, Heart } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAuth } from '@clerk/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const MovieCard = ({movie, isFavorite = false}) => {
    const [fav, setFav] = useState(isFavorite);
    const { getToken, isSignedIn } = useAuth();

    if(!movie){
        return null;
    }
   const navigate= useNavigate()

   const handleFavorite = async (e) => {
        e.stopPropagation();
        if (!isSignedIn) {
            return toast.error("Please login to add favorites");
        }
        
        try {
            const token = await getToken();
            const res = await axios.post('http://localhost:3000/api/favorite/toggle', { movieId: movie._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setFav(res.data.isFavorite);
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error("Failed to toggle favorite");
        }
    }

  return (
    <div className='relative flex flex-col justify-between p-3 bg-gray-800
    rounded-2xl hover:-translate-y-1 transition duration-300 w-56'>
      
      <div className="absolute top-5 right-5 z-10 bg-black/50 p-1.5 rounded-full cursor-pointer hover:bg-black/70 transition" onClick={handleFavorite}>
        <Heart className={`w-5 h-5 ${fav ? 'fill-red-500 text-red-500' : 'text-white'}`} />
      </div>

      <img onClick={()=>{navigate(`/movies/${movie._id}`);scroll(0,0)}}
      src={movie.backdrop_path?.startsWith('/') ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : movie.backdrop_path} alt="" className='rounded-lg h-40 w-full
      object-cover object-right-bottom cursor-pointer'/>

    <p className='font-semibold mt-2 truncate'>{movie.title}</p>

    <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.release_date).getFullYear()} • {movie.genres.slice(0,2).map(genre=> genre.name).join(" | ")}• {timeFormat(movie.runtime)}
    </p>
    
    <div className='flex items-center justify-between mt-4 pb-3'>
        <button onClick={()=>{navigate(`/movies/${movie._id}`);scroll(0,0)}} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Buy Tickets</button>
        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
            <StarIcon className="w-4 h-4 text-primary fill-primary"/>
            {movie.vote_average.toFixed(1)}
        </p>
    </div>

    </div>
  )
}

export default MovieCard
