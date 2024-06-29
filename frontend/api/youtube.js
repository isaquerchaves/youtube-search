// URL da sua API do backend
const apiUrl = 'http://localhost:3000/api/youtube';

// Função para buscar vídeos no YouTube
export function searchYouTubeVideos(query) {
    return fetch(`${apiUrl}/search?q=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar vídeos');
            }
            return response.json();
        })
        .then(data => {
            return data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title
            }));
        })
        .catch(error => {
            console.error('Erro na busca de vídeos:', error);
            return []; // Retorna um array vazio em caso de erro
        });
}

// Função para adicionar um vídeo aos favoritos
export function addVideoToFavorites(videoId) {
    return fetch(`${apiUrl}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar vídeo aos favoritos');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erro ao adicionar vídeo aos favoritos:', error);
        throw error;
    });
}

// Função para remover um vídeo dos favoritos
export function removeVideoFromFavorites(videoId) {
    return fetch(`${apiUrl}/favorites/${videoId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao remover vídeo dos favoritos');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Erro ao remover vídeo dos favoritos:', error);
        throw error;
    });
}
