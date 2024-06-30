const favoriteVideos = new Set();

function searchVideos(query) {
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = '';

    fetch(`http://localhost:3000/api/youtube/search?q=${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoTitle = item.snippet.title;
                    const thumbnailUrl = item.snippet.thumbnails.default.url;

                    const isFavorite = isVideoInFavorites(videoId);
                    const favoriteButton = createFavoriteButton(videoId, isFavorite);

                    const videoElement = createVideoElement(videoId, videoTitle, thumbnailUrl, favoriteButton);
                    videosContainer.appendChild(videoElement);
                });
            } else {
                console.log('Nenhum vídeo encontrado.');
            }
        })
        .catch(error => console.error('Erro ao buscar vídeos:', error));
}

function createVideoElement(videoId, title, thumbnailUrl, favoriteButton) {
    const videoElement = document.createElement('div');
    videoElement.classList.add('video-item');

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = thumbnailUrl;
    thumbnailImg.alt = title;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const linkElement = document.createElement('a');
    linkElement.href = `https://www.youtube.com/watch?v=${videoId}`;
    linkElement.target = '_blank';
    linkElement.appendChild(thumbnailImg);
    linkElement.appendChild(titleElement);

    videoElement.appendChild(linkElement);
    videoElement.appendChild(favoriteButton);

    return videoElement;
}

function isVideoInFavorites(videoId) {
    return favoriteVideos.has(videoId);
}

function createFavoriteButton(videoId, isFavorite) {
    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-button');

    if (isFavorite) {
        favoriteButton.textContent = '★';
        favoriteButton.classList.add('selected');
    } else {
        favoriteButton.textContent = '☆';
    }

    favoriteButton.addEventListener('click', () => {
        if (favoriteButton.classList.contains('selected')) {
            removeFromFavorites(videoId, favoriteButton);
        } else {
            addToFavorites(videoId, favoriteButton);
        }
    });

    return favoriteButton;
}

document.getElementById('searchButton').addEventListener('click', handleSearchButtonClick);

function handleSearchButtonClick() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        searchVideos(query);
        document.getElementById('searchInput').value = '';
    }
}

document.getElementById('searchInput').addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSearchButtonClick();
    }
});

document.getElementById('videosLink').addEventListener('click', () => {
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = '';
    document.getElementById('mf_videos').style.display = 'block';
    document.getElementById('mf_favorites').style.display = 'none';
});
