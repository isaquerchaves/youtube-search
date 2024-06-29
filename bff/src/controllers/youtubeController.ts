import { Request, Response } from 'express';
import axios from 'axios';

export const searchVideos = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const apiKey = 'AIzaSyAcceA4_ILsiCtGeGQKixAqW1heCQMD2qo';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos', error });
    }
};
