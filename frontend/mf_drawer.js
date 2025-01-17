document.addEventListener('DOMContentLoaded', function() {
    const videosLink = document.getElementById('videosLink');
    const favoritesLink = document.getElementById('favoritesLink');
    const mfVideosSection = document.getElementById('mf_videos');

    videosLink.addEventListener('click', function(event) {
        event.preventDefault();
        mfVideosSection.style.display = 'block';
        mfFavoritesSection.style.display = 'none';
    });

    favoritesLink.addEventListener('click', function(event) {
        event.preventDefault();
        mfVideosSection.style.display = 'none';
        mfFavoritesSection.style.display = 'block';
        updateFavoritesContainer();
    });
});
