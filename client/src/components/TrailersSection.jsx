import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'

const TrailersSection = ({ movies = [] }) => {
    const trailerMovies = movies.filter(m => m.trailer_url);
    const [currentTrailer, setCurrentTrailer]= useState(trailerMovies.length > 0 ? trailerMovies[0] : null);

    // Update currentTrailer if movies loads later
    React.useEffect(() => {
      if (!currentTrailer && trailerMovies.length > 0) {
        setCurrentTrailer(trailerMovies[0]);
      }
    }, [trailerMovies, currentTrailer]);

  if (trailerMovies.length === 0) return null;

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
        <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailers</p>

        <div className='relative mt-6 flex justify-center'>
            <BlurCircle top='-100px' right='-100px'/>
            {currentTrailer && (
               <ReactPlayer
                  url={currentTrailer.trailer_url}
                  controls
                  width="960px"
                  height="540px"
                  className="mx-auto max-w-full"
                />
            )}
        </div>
      <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {trailerMovies.slice(0, 4).map((movie)=>(
            <div key={movie._id} className='relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300
            transition max-md:h-60 md:max-h-60 cursor-pointer' onClick={()=>setCurrentTrailer(movie)}>
                <img src={movie.backdrop_path?.startsWith('/') ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : movie.backdrop_path} alt="trailer" className='rounded-lg w-full h-full object-cover brightness-75'/>
                <PlayCircleIcon strokeWidth={1.6} className="absolute top-1/2 left-1/2
                w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2
                -translate-y-1/2 text-white"/>
            </div>
        ))}

      </div>
    </div>
  )
}

export default TrailersSection
