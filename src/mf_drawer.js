document.addEventListener('DOMContentLoaded', function () {
  loadComponent('videos'); // Load the default component
  updateFavoritesCountInDrawer(); // Inicializar contagem de favoritos
});

document.getElementById('mf_drawer').innerHTML = `
  <h2>mf_drawer</h2>
  <ul>
      <li><a href="#" id="videos-link">VÍDEOS</a></li>
      <li><a href="#" id="favorites-link">FAVORITOS <span id="favorites-count-drawer">(0)</span></a></li>
  </ul>
`;

document.getElementById('videos-link').addEventListener('click', function () {
  loadComponent('videos');
});

document.getElementById('favorites-link').addEventListener('click', function () {
  loadComponent('favorites');
});

function loadComponent(component) {
  fetch(`components/${component}.html`)
      .then(response => response.text())
      .then(html => {
          document.getElementById('content').innerHTML = html;
          if (component === 'videos') {
              initializeVideos();
          } else if (component === 'favorites') {
              renderFavorites();
          }
      });
}

function updateFavoritesCountInDrawer() {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const favoritesCount = document.getElementById('favorites-count-drawer');
  if (favoritesCount) {
      favoritesCount.textContent = `(${favorites.length})`;
  }
}
