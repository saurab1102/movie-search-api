import express, { Request, response, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({message: "Welcome to the Movie Search API!"});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


import { fetchMovies } from '../utils/fetchMovies';
import logger from '../utils/logger';

app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.get('/search', async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if(!query){
        logger.warn('Missing query paramenter "q"');
        return res.status(400).json({ error: 'Query paramenter "q" is required.'});
    }

    try {
        const response= await fetchMovies(query);

        if (response.Response === 'False') {
            logger.info(`No movies found for query: "${query}"`);
            return res.status(404).json({error: response.Error || 'No movies found.'});

        }

        const movies = response.Search.map((movie: any) => ({
            title: movie.Title,
            year: movie.Year,
            imdbID: movie.imdbID,
            type: movie.Type,
            poster: movie.Poster,
        }));

        logger.info(`Successfully fetched ${movies.length} movies for query: "${query}"`);
        res.status(200).json({movies, totalResutls: response.totalResutls});
    } catch (error) {
        logger.error(`Error fetching movies: ${error}`);
        res.status(500).json({ error: 'Failed to fetch movies. Please try again later.'});
    }
});