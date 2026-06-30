import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import TrailersSection from '../components/TrailersSection'

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/movie/all');
        if (res.data.success) {
          setMovies(res.data.movies);
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <>
      <HeroSection movies={movies} />
      <FeaturedSection movies={movies} />
      <TrailersSection movies={movies} />
    </>
  )
}

export default Home
