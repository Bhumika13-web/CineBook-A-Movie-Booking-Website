import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'

const Favourite = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = await getToken()
        if (token) {
          const res = await axios.get('http://localhost:3000/api/favorite/my-favorites', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.data.success) {
            setFavorites(res.data.movies)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  if (loading) return <Loading />

  return favorites.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>

      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {favorites.map((movie) => (
          <MovieCard movie={movie} key={movie._id} isFavorite={true} />
        ))}
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center h-[80vh]'>
      <h1 className='text-2xl font-bold text-center text-gray-400'>No Favorites Yet</h1>
      <p className='text-gray-500 mt-2'>Heart some movies to see them here.</p>
    </div>
  )
}

export default Favourite
