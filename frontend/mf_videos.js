const favoriteVideos = new Set();

// Ao receber a lista de favoritos da API, popular o set favoriteVideos
function populateFavoriteVideos() {
    fetch('http://localhost:3000/api/youtube/favorites/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }
            return response.json();
        })
        .then(favorites => {
            favorites.forEach(favorite => {
                favoriteVideos.add(favorite.id);
            });
            // Após popular os favoritos, chamar a função para buscar vídeos
            searchVideos('');
        })
        .catch(error => console.error('Error loading favorites:', error));
}

// Função para buscar vídeos e verificar favoritos
function searchVideos(query) {
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = '';

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

                    // Verifica se o vídeo está nos favoritos para definir o botão inicialmente
                    const isFavorite = isVideoInFavorites(videoId);
                    const favoriteButton = createFavoriteButton(videoId, isFavorite);

                    // Criação do elemento de vídeo
                    const videoElement = createVideoElement(videoId, videoTitle, thumbnailUrl, favoriteButton);
                    videosContainer.appendChild(videoElement);
                });
            } else {
                console.log('Nenhum vídeo encontrado.');
            }
        })
        .catch(error => console.error('Erro ao buscar vídeos:', error));
}

// Função para verificar se um vídeo está nos favoritos
function isVideoInFavorites(videoId) {
    // Retorna true se o vídeoId estiver na lista de favoritos, caso contrário, false
    return favoriteVideos.has(videoId);
}

// Função para criar elemento de vídeo com botão de favorito dinâmico
function createVideoElement(videoId, title, thumbnailUrl, favoriteButton) {
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

    // Adiciona o botão de favorito
    videoElement.appendChild(linkElement);
    videoElement.appendChild(favoriteButton);

    return videoElement;
}

// Função para criar botão de favorito com lógica de adicionar/remover
function createFavoriteButton(videoId, isFavorite) {
    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-button');

    // Define o texto e a classe do botão com base no estado de favorito
    if (isFavorite) {
        favoriteButton.textContent = '★';
        favoriteButton.classList.add('selected');
    } else {
        favoriteButton.textContent = '☆';
    }

    // Adiciona evento de clique para adicionar ou remover dos favoritos
    favoriteButton.addEventListener('click', () => {
        if (favoriteButton.classList.contains('selected')) {
            removeFromFavorites(videoId, favoriteButton);
        } else {
            addToFavorites(videoId, favoriteButton);
        }
    });

    return favoriteButton;
}

// Função para adicionar vídeo aos favoritos
async function addToFavorites(videoId, button) {
    try {
        const response = await fetch('http://localhost:3000/api/youtube/favorites/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
            
        });
        updateFavoritesCount();

        if (!response.ok) {
            throw new Error('Failed to add to favorites');
        }

        // Adiciona o vídeo aos favoritos localmente
        favoriteVideos.add(videoId);
        
        // Atualiza o botão para exibir ★ e marca como selecionado
        button.textContent = '★';
        button.classList.add('selected');

    } catch (error) {
        console.error('Error adding to favorites:', error);
        // Tratar o estado de erro ou exibir uma mensagem para o usuário
    }
}

// Função para remover vídeo dos favoritos
async function removeFromFavorites(videoId, button) {
    try {
        const response = await fetch(`http://localhost:3000/api/youtube/favorites/remove/${videoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
            throw new Error('Failed to remove from favorites');
        }

        // Remove o vídeo dos favoritos localmente
        favoriteVideos.delete(videoId);
        
        // Atualiza o botão para exibir ☆ e remove a marcação de selecionado
        button.textContent = '☆';
        button.classList.remove('selected');

        // Se estiver na página de favoritos, remove o vídeo da lista
        const isFavoritesPage = document.getElementById('mf_favorites').style.display === 'block';
        if (isFavoritesPage) {
            const videoElement = button.parentElement;
            videoElement.remove();
        }

        // Atualiza a contagem de favoritos
        updateFavoritesCount();

    } catch (error) {
        console.error('Error removing from favorites:', error);
        // Tratar o estado de erro ou exibir uma mensagem para o usuário
    }
}

// Função para atualizar a contagem de favoritos
function updateFavoritesCount() {
    fetch('http://localhost:3000/api/youtube/favorites/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites count');
            }
            return response.json();
        })
        .then(favorites => {
            const favoritesCount = favorites.length;
            const favoritesCountElement = document.getElementById('favoritesCount');
            favoritesCountElement.textContent = `(${favoritesCount})`;
        })
        .catch(error => console.error('Error fetching favorites count:', error));
}

// Atualiza a interface de favoritos ao carregar a página
function updateFavoritesContainer() {
    const favoritesContainer = document.getElementById('favoritesContainer');
    favoritesContainer.innerHTML = '';

    fetch('http://localhost:3000/api/youtube/favorites/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch favorites');
            }
            return response.json();
        })
        .then(favorites => {
            favorites.forEach(favorite => {
                const videoId = favorite.id;
                fetch(`http://localhost:3000/api/youtube/search/${videoId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch video details');
                        }
                        return response.json();
                    })
                    .then(data => {
                        const videoTitle = data.items[0].snippet.title;
                        const thumbnailUrl = data.items[0].snippet.thumbnails.default.url;

                        const favoriteButton = createFavoriteButton(videoId, true);
                        const videoElement = createVideoElement(videoId, videoTitle, thumbnailUrl, favoriteButton);
                        favoritesContainer.appendChild(videoElement);
                    })
                    .catch(error => console.error('Erro ao buscar vídeo favorito:', error));
            });

            // Atualiza a contagem de favoritos
            updateFavoritesCount();
        })
        .catch(error => console.error('Error loading favorites:', error));
}

// Event listener para o botão de busca
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', handleSearchButtonClick);

function handleSearchButtonClick() {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        searchVideos(query);
        document.getElementById('searchInput').value = '';
    }
}

// Event listener para a tecla Enter no campo de pesquisa
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        handleSearchButtonClick();
    }
});

// Event listener para o botão de favoritos na aba de Vídeos
const videosLink = document.getElementById('videosLink');
videosLink.addEventListener('click', () => {
    const videosContainer = document.getElementById('videosContainer');
    videosContainer.innerHTML = '';
    document.getElementById('mf_videos').style.display = 'block';
    document.getElementById('mf_favorites').style.display = 'none';
});

// Event listener para o botão de favoritos na aba de Favoritos
const favoritesLink = document.getElementById('favoritesLink');
favoritesLink.addEventListener('click', () => {
    document.getElementById('mf_videos').style.display = 'none';
    document.getElementById('mf_favorites').style.display = 'block';
    updateFavoritesContainer();
});

// Atualiza a contagem de favoritos ao carregar a página
updateFavoritesCount();
populateFavoriteVideos();