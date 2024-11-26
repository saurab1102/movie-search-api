import express, { Request, Response } from 'express';
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