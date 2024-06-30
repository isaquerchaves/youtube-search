import { Request, Response } from 'express';
import axios from 'axios';
import Favorite from '../models/Favorite';

// ORIGINAL KEY = AIzaSyAEcL3ef1SzlMoU89F58lvAq0TvHJcd7D0
// TESTING KEY = AIzaSyBWRIAve3-jvoiL6a1zrIiNPruFozF32Vw

const apiKey = 'AIzaSyBWRIAve3-jvoiL6a1zrIiNPruFozF32Vw';

// Buscar videos
export const searchVideos = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const maxVideosResponse = 12;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=${maxVideosResponse}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos', error });
    }
};

// Buscar videos por id
export const getVideoById = async (req: Request, res: Response): Promise<void> => {
    const videoId = req.params.videoId;

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Error fetching video', error });
    }
};

// Adicionar vídeo aos favoritos
export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const { videoId } = req.body;

        // Validação básica do videoId
        if (!videoId || typeof videoId !== 'string') {
            res.status(400).json({ message: 'Invalid videoId provided.' });
            return;
        }

        // Verifique se o vídeo já está nos favoritos
        const existingFavorite = await Favorite.findOne({ where: { id: videoId } });

        if (existingFavorite) {
            res.status(400).json({ message: 'Video already exists in favorites.' });
            return;
        }

        // Adicione o vídeo aos favoritos
        const newFavorite = await Favorite.create({ id: videoId });

        res.status(201).json(newFavorite);
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Failed to add video to favorites.', error });
    }
};

// Função para remover vídeo dos favoritos
export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const { videoId } = req.params;

        // Verifique se o vídeo está nos favoritos
        const existingFavorite = await Favorite.findOne({ where: { id: videoId } });

        if (!existingFavorite) {
            res.status(404).json({ message: 'Video not found in favorites.' });
            return;
        }

        // Remova o vídeo dos favoritos
        await existingFavorite.destroy();

        res.json({ message: 'Video removed from favorites.' });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        res.status(500).json({ message: 'Failed to remove video from favorites.', error });
    }
};

// Função para obter todos os vídeos favoritos
export const getAllFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const favorites = await Favorite.findAll({
            attributes: ['id']
        });

        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Failed to fetch favorites.', error });
    }
};
