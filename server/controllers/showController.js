import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getNowPlayingMovies = async(req, res)=>{
    try{
       const {data} = await axios.get('https://api.tmdb.org/3/movie/now_playing',{
        headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
       })
       const movies =data.results;
       res.json({success:true,movie:movies})
    }catch(error){
       console.error(error);
       res.json({
           success: false, 
           message: error.response?.data?.message || error.message || "An unknown error occurred"
       });
    }
}

export const addShow = async (req, res)=>{
    try{
       const {movieId, showsInput, showPrice}= req.body

       let movie= await Movie.findById(movieId)

       if(!movie){
        const [movieDetailsResponse, movieCreditsResponse, movieVideosResponse]= await Promise.all([
            axios.get(`https://api.tmdb.org/3/movie/${movieId}`,{
                headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
            }),
            axios.get(`https://api.tmdb.org/3/movie/${movieId}/credits`,{
                headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
            }),
            axios.get(`https://api.tmdb.org/3/movie/${movieId}/videos`,{
                headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
            })
        ]);

        const movieApiData= movieDetailsResponse.data;
        const movieCreditsData= movieCreditsResponse.data;
        const movieVideosData = movieVideosResponse.data.results;
        
        let trailer_url = "";
        const trailer = movieVideosData.find(vid => vid.type === "Trailer" && vid.site === "YouTube");
        if (trailer) {
            trailer_url = `https://www.youtube.com/watch?v=${trailer.key}`;
        }

        const movieDetails={
            _id:movieId,
            title:movieApiData.title,
            overview:movieApiData.overview,
            poster_path:movieApiData.poster_path,
            backdrop_path:movieApiData.backdrop_path,
            genres:movieApiData.genres,
            casts:movieCreditsData.cast,
            release_date:movieApiData.release_date,
            original_language:movieApiData.original_language,
            tagline:movieApiData.tagline || "",
            vote_average:movieApiData.vote_average,
            runtime:movieApiData.runtime,
            trailer_url
        }

        movie=await Movie.create(movieDetails);
       }
       const showsToCreate =[];
       showsInput.forEach(show=>{
        const showDate =show.date;
        show.time.forEach((time)=>{
            const dateTimeString=`${showDate}T${time}`;
            showsToCreate.push({
                movie:movieId,
                showDateTime:new Date(dateTimeString),
                showPrice,
                occupiedSeats: {}
            })
        })
       });

      if(showsToCreate.length>0){
        await Show.insertMany(showsToCreate);
      }
      res.json({success:true, message:'Show Added Successfully.'})

    }catch(error){
       console.error(error);
       res.json({
           success: false, 
           message: error.response?.data?.message || error.message || "An unknown error occurred"
       });
    }
}

export const getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({}).populate('movie').sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "Error fetching shows" });
    }
};