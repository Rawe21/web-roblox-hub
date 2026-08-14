// ---------------------------------------------------------------
// Roblox-clone interactivity: carousels, dropdowns, sidebar, mobile nav
// ---------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
    initDropdowns();
    initSidebarToggle();
    initMobileNav();
    initResponsiveSidebarSync();
    initGameTiles();
});

const MOBILE_BREAKPOINT = 900;

// Keeps the desktop "collapsed" state and the mobile "slide-in" state from
// ever being active at the same time — mixing the two caused a narrow,
// overlapping sidebar to appear when the viewport was resized without a
// full page reload (e.g. rotating a device or resizing a browser window).
function initResponsiveSidebarSync() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const sync = () => {
        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        if (isMobile) {
            sidebar.classList.remove('collapsed');
        } else {
            sidebar.classList.remove('mobile-open');
        }
    };

    sync();
    window.addEventListener('resize', sync);
}

// --- Horizontal carousel scroll buttons -------------------------
function initCarousels() {
    document.querySelectorAll('.carousel-controls').forEach((controls) => {
        const targetId = controls.dataset.target;
        const row = document.getElementById(targetId);
        if (!row) return;

        const leftBtn = controls.querySelector('.scroll-left');
        const rightBtn = controls.querySelector('.scroll-right');
        const scrollAmount = () => Math.max(row.clientWidth * 0.8, 220);

        leftBtn?.addEventListener('click', () => {
            row.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
        });

        rightBtn?.addEventListener('click', () => {
            row.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
        });
    });
}

// --- Dropdown menus (profile + notifications) --------------------
function initDropdowns() {
    const dropdownPairs = [
        { trigger: document.getElementById('profilePill'), panel: document.getElementById('profileDropdown') },
        { trigger: document.getElementById('notifBtn'), panel: document.getElementById('notifDropdown') },
    ];

    dropdownPairs.forEach(({ trigger, panel }) => {
        if (!trigger || !panel) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = panel.classList.contains('is-open');
            closeAllDropdowns();
            if (!isOpen) {
                panel.classList.add('is-open');
                trigger.classList.add('is-open');
            }
        });

        // Prevent clicks inside the panel from closing it via the document listener,
        // except for actual links/items which should navigate normally.
        panel.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener('click', closeAllDropdowns);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllDropdowns();
    });

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-panel.is-open').forEach((p) => p.classList.remove('is-open'));
        document.querySelectorAll('.profile-pill.is-open').forEach((p) => p.classList.remove('is-open'));
    }
}

// --- Collapsible sidebar (desktop) --------------------------------
function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) return;
        const collapsed = sidebar.classList.toggle('collapsed');
        toggleBtn.textContent = collapsed ? '›' : '‹';
    });
}

// --- Game tiles: clicking a real game opens its detail page in a new tab --
function initGameTiles() {
    document.querySelectorAll('.game-tile:not(.game-tile--empty)').forEach((tile) => {
        // Only tiles carrying game info (set via data-name) get the detail-page behavior.
        if (!tile.dataset.name) return;

        tile.addEventListener('click', (e) => {
            e.preventDefault();

            const params = new URLSearchParams({
                name: tile.dataset.name || '',
                img: tile.dataset.img || '',
                rating: tile.dataset.rating || '',
                visits: tile.dataset.visits || '',
                desc: tile.dataset.desc || '',
                play: tile.dataset.play || '#',
            });

            window.open(`game.html?${params.toString()}`, '_blank');
        });
    });
}

// --- Mobile hamburger nav (opens the sidebar as a slide-in panel) --
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    if (!navToggle || !sidebar) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
        if (
            sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) &&
            e.target !== navToggle
        ) {
            sidebar.classList.remove('mobile-open');
        }
    });
}