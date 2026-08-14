document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.getElementById('gameName');
    if (!nameEl) return; // not on game.html

    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || 'Untitled Game';
    const img = params.get('img') || '';
    const rating = params.get('rating') || 'N/A';
    const visits = params.get('visits') || 'N/A';
    const desc = params.get('desc') || 'No description available for this game yet.';
    const playUrl = params.get('play') || '';

    document.title = `${name} - Roblox`;
    nameEl.textContent = name;
    document.getElementById('gameRating').textContent = rating;
    document.getElementById('gameVisits').textContent = visits;
    document.getElementById('gameDesc').textContent = desc;

    const heroImg = document.getElementById('gameHeroImg');
    const thumbImg = document.getElementById('gameThumbImg');
    if (img) {
        heroImg.src = img;
        heroImg.alt = name;
        thumbImg.src = img;
        thumbImg.alt = name;
    }

    const playBtn = document.getElementById('playBtn');
    if (!playUrl || playUrl === '#') {
        playBtn.textContent = 'Coming Soon';
        playBtn.disabled = true;
    } else {
        playBtn.addEventListener('click', () => {
            window.location.href = playUrl;
        });
    }
});