import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({ movies = [] }) => {
  const navigate= useNavigate()
  
  const heroMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'
         style={{ backgroundImage: heroMovie ? `url(${heroMovie.backdrop_path?.startsWith('/') ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` : heroMovie.backdrop_path})` : 'url("/backgroundimg.png")' }}>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>
      <div className="z-10 flex flex-col items-start gap-4">
          <img src={assets.marvelLogo} alt="" className="max-h-8 lg:h-8 mt-20"/>

          <h1 className='text-3xl md:text-[40px] md:leading-14 font-semibold max-w-90'>{heroMovie ? heroMovie.title : 'Guardians: of the Galaxy'}</h1>
          
          {heroMovie && (
            <div className='flex items-center gap-4 text-gray-300'>
              <span>{heroMovie.genres.slice(0,3).map(g => g.name).join(' | ')}</span>
              <div className='flex items-center gap-1'>
                  <CalendarIcon className='w-4.5 h-4.5'/> {new Date(heroMovie.release_date).getFullYear()}
              </div>
              <div className='flex items-center gap-1'>
                  <ClockIcon  className='w-4.5 h-4.5'/> {Math.floor(heroMovie.runtime / 60)}h {heroMovie.runtime % 60}m
              </div>
            </div>
          )}
          
        <p className='max-w-md text-gray-300 line-clamp-3'>{heroMovie ? heroMovie.overview : 'In a post-apocalyptic world where coties ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.'}</p>
        <button onClick={()=> navigate(heroMovie ? `/movies/${heroMovie._id}` : '/movies')} className='flex items-center gap-1 px-4 py-2 text-xs bg-primary
        hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
          {heroMovie ? 'Book Tickets' : 'Explore Movies'}
          <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}

export default HeroSection
