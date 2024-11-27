import axios from 'axios';

export const fetchMovies = async (searchQuery: string) => {
    const apiKey = process.env.OMDB_API_KEY;
    if(!apiKey) {
        throw new Error("OMDB_API_KEY is not defined in the environment variables.");
    }

    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url);
    return response.data;
};