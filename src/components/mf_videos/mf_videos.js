const apiKey = 'AIzaSyAcceA4_ILsiCtGeGQKixAqW1heCQMD2qo';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Inicializar eventos para o componente de vídeos
function initializeVideos() {
    document.getElementById('search-button').addEventListener('click', searchVideos);
    updateFavoritesCountInDrawer(); // Atualizar contagem no drawer ao inicializar
    renderFavorites(); // Renderizar favoritos ao inicializar
    loadPopularVideos(); // Carregar vídeos mais assistidos ao inicializar
}

// Carregar vídeos populares/recomendados
function loadPopularVideos() {
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const videosList = document.getElementById('videos-list');
            videosList.innerHTML = '';
            data.items.forEach(item => {
                const videoItem = createVideoItem(item);
                videosList.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar vídeos populares:', error);
        });
}

// Buscar vídeos usando a API do YouTube
function searchVideos() {
    const query = document.getElementById('search-input').value;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const videosList = document.getElementById('videos-list');
            videosList.innerHTML = '';
            data.items.forEach(item => {
                const videoItem = createVideoItem(item);
                videosList.appendChild(videoItem);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar vídeos:', error);
        });
}

// Criar um item de vídeo com botão de favorito
function createVideoItem(video) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${video.id.videoId || video.id}" frameborder="0" allowfullscreen></iframe>
        <button class="favorite-button">⭐</button>
    `;
    videoItem.querySelector('.favorite-button').addEventListener('click', function () {
        toggleFavorite(video);
    });
    return videoItem;
}

// Alternar entre adicionar e remover um vídeo dos favoritos
function toggleFavorite(video) {
    const videoId = video.id.videoId || video.id;
    const index = favorites.findIndex(fav => fav.id === videoId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        const videoDetails = {
            id: videoId,
            title: video.snippet.title
        };
        favorites.push(videoDetails);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    updateFavoritesCountInDrawer(); // Atualizar contagem no drawer
    renderFavorites();
}

// Atualizar o contador de favoritos
function updateFavoritesCount() {
    const favoritesCount = document.getElementById('favorites-count');
    if (favoritesCount) {
        favoritesCount.textContent = `Total de Favoritos: ${favorites.length}`;
    }
}

// Renderizar a lista de vídeos favoritos
function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (favoritesList) {
        favoritesList.innerHTML = '';
        favorites.forEach(video => {
            const videoItem = createVideoItem(video);
            favoritesList.appendChild(videoItem);
        });
    }
}

// Atualizar contagem de favoritos no drawer
function updateFavoritesCountInDrawer() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesCount = document.getElementById('favorites-count-drawer');
    if (favoritesCount) {
        favoritesCount.textContent = `(${favorites.length})`;
    }
}

// Carregar favoritos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', function () {
    updateFavoritesCountInDrawer(); // Atualizar contagem de favoritos no drawer ao inicializar
    renderFavorites(); // Renderizar favoritos ao inicializar
    loadPopularVideos(); // Carregar vídeos mais assistidos ao inicializar
});