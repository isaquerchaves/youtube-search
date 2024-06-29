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

    videoElement.appendChild(linkElement);

    return videoElement;
}


// Função para alternar estado de favorito
function toggleFavorite(videoId) {
  // Lógica para adicionar/remover da lista de favoritos
  // Atualizar contador de favoritos
  const favCountElement = document.getElementById('favCount');
  // Exemplo de como atualizar o contador (você precisa implementar a lógica de favoritos)
  const currentCount = parseInt(favCountElement.textContent);
  const newCount = videoIsFavorite(videoId) ? currentCount - 1 : currentCount + 1;
  favCountElement.textContent = newCount;
}

// Função para lidar com a busca ao pressionar Enter
function handleSearch(event) {
  if (event.key === 'Enter') {
      const query = event.target.value.trim();
      if (query) {
          searchVideos(query);
      }
  }
}

// Event listener para o campo de busca
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', handleSearch);
