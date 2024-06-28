const apiKey = 'AIzaSyAcceA4_ILsiCtGeGQKixAqW1heCQMD2qo';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Inicializar eventos para o componente de vídeos
function initializeVideos() {
    document.getElementById('search-button').addEventListener('click', searchVideos);
    updateFavoritesCountInDrawer(); // Atualizar contagem no drawer ao inicializar
    renderFavorites(); // Renderizar favoritos ao inicializar
}

// Buscar vídeos usando a API do YouTube
function searchVideos() {
    const query = document.getElementById('search-input').value;
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const videosList = document.getElementById('videos-list');
            videosList.innerHTML = '';
            data.items.forEach(item => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                videoItem.innerHTML = `
                    <iframe src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
                    <button class="favorite-button">⭐</button>
                `;
                videoItem.querySelector('.favorite-button').addEventListener('click', function () {
                    toggleFavorite(item);
                });
                videosList.appendChild(videoItem);
            });
        });
}

// Alternar entre adicionar e remover um vídeo dos favoritos
function toggleFavorite(video) {
    const index = favorites.findIndex(fav => fav.id.videoId === video.id.videoId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(video);
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
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>
                <button class="remove-favorite-button">❌</button>
            `;
            videoItem.querySelector('.remove-favorite-button').addEventListener('click', function () {
                toggleFavorite(video);
            });
            favoritesList.appendChild(videoItem);
        });
    }
}

// Atualizar contagem de favoritos no drawer
function updateFavoritesCountInDrawer() {
    const favoritesCount = document.getElementById('favorites-count-drawer');
    if (favoritesCount) {
        favoritesCount.textContent = `(${favorites.length})`;
    }
}

// Carregar favoritos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', function () {
    updateFavoritesCountInDrawer(); // Atualizar contagem de favoritos no drawer ao inicializar
    renderFavorites(); // Renderizar favoritos ao inicializar
});