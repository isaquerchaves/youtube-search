document.addEventListener('DOMContentLoaded', function() {
  const videosLink = document.getElementById('videosLink');
  const favoritesLink = document.getElementById('favoritesLink');
  const mfVideosSection = document.getElementById('mf_videos');
  const mfFavoritesSection = document.getElementById('mf_favorites');

  videosLink.addEventListener('click', function(event) {
      event.preventDefault();
      mfVideosSection.style.display = 'block';
      mfFavoritesSection.style.display = 'none';
  });

  favoritesLink.addEventListener('click', function(event) {
      event.preventDefault();
      mfVideosSection.style.display = 'none';
      mfFavoritesSection.style.display = 'block';
      loadFavorites(); // Carregar vídeos favoritos ao clicar
  });
});

function loadFavorites() {
  // Lógica para carregar e exibir os vídeos favoritos
  const favoritesContainer = document.getElementById('favoritesContainer');
  favoritesContainer.innerHTML = ''; // Limpa o conteúdo anterior

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length > 0) {
      favorites.forEach(video => {
          const videoElement = createVideoElement(video.id, video.title, video.thumbnail);
          favoritesContainer.appendChild(videoElement);
      });
  } else {
      favoritesContainer.innerHTML = '<p>Nenhum vídeo favorito encontrado.</p>';
  }
}
