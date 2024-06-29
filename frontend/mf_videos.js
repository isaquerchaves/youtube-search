const favoriteVideos = new Set();

function searchVideos(query) {
    fetch(`http://localhost:3000/api/youtube/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            const videosContainer = document.getElementById('videosContainer');
            videosContainer.innerHTML = ''; // Limpa o conteúdo anterior

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoTitle = item.snippet.title;
                    const thumbnailUrl = item.snippet.thumbnails.default.url;

                    // Criação do elemento de vídeo
                    const videoElement = createVideoElement(videoId, videoTitle, thumbnailUrl);
                    videosContainer.appendChild(videoElement);
                });
            } else {
                console.log('Nenhum vídeo encontrado.');
            }
        })
        .catch(error => console.error('Erro ao buscar vídeos:', error));
}

function createVideoElement(videoId, title, thumbnailUrl) {
    // Cria um elemento de vídeo HTML
    const videoElement = document.createElement('div');
    videoElement.classList.add('video-item');

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = title;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const linkElement = document.createElement('a');
    linkElement.href = `https://www.youtube.com/watch?v=${videoId}`;
    linkElement.target = '_blank'; // Abre o link em uma nova aba
    linkElement.appendChild(thumbnailImg);
    linkElement.appendChild(titleElement);

    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-button');
    favoriteButton.textContent = favoriteVideos.has(videoId) ? '★' : '☆';
    if (favoriteVideos.has(videoId)) {
        favoriteButton.classList.add('selected');
    }
    favoriteButton.addEventListener('click', () => toggleFavorite(videoId, favoriteButton));

    videoElement.appendChild(linkElement);
    videoElement.appendChild(favoriteButton);

    return videoElement;
}

function handleSearchButtonClick() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        searchVideos(query);
        document.getElementById('searchInput').value = '';
    }
}

// Event listener para o botão de busca
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', handleSearchButtonClick);

// favorito
function toggleFavorite(videoId, button) {
    if (favoriteVideos.has(videoId)) {
        favoriteVideos.delete(videoId);
        button.textContent = '☆';
        button.classList.remove('selected');
    } else {
        favoriteVideos.add(videoId);
        button.textContent = '★';
        button.classList.add('selected');
    }
    updateFavoritesContainer();
}

function updateFavoritesContainer() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';

    favoriteVideos.forEach(videoId => {
        // Reutilize a lógica para buscar detalhes dos vídeos favoritos e renderizá-los
        fetch(`http://localhost:3000/api/youtube/video?id=${videoId}`)
            .then(response => response.json())
            .then(data => {
                const videoElement = createVideoElement(videoId, data.title, data.thumbnailUrl);
                favoritesContainer.appendChild(videoElement);
            })
            .catch(error => console.error('Erro ao buscar vídeo favorito:', error));
    });
}

function handleSearch(event) {
    if (event.key === 'Enter' || event.type === 'click') {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            searchVideos(query);
            document.getElementById('searchInput').value = ''; 
        }
    }
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', handleSearch);

const videosLink = document.getElementById('videosLink');
const favoritesLink = document.getElementById('favoritesLink');

videosLink.addEventListener('click', () => {
    document.getElementById('mf_videos').style.display = 'block';
    document.getElementById('mf_favorites').style.display = 'none';
});

favoritesLink.addEventListener('click', () => {
    document.getElementById('mf_videos').style.display = 'none';
    document.getElementById('mf_favorites').style.display = 'block';
    updateFavoritesContainer();
});