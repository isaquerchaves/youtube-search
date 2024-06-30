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

document.getElementById('favoritesLink').addEventListener('click', () => {
  document.getElementById('mf_videos').style.display = 'none';
  document.getElementById('mf_favorites').style.display = 'block';
  updateFavoritesContainer();
});

// Inicializa ao carregar a página
updateFavoritesCount();
populateFavoriteVideos();
