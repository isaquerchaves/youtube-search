import express from 'express';
import cors from 'cors';
import youtubeRoutes from './routes/youtube';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
