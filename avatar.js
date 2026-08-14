// ---------------------------------------------------------------
// Avatar editor: tab filtering, equip/unequip, random outfit,
// state saved to localStorage so it persists between visits.
// ---------------------------------------------------------------

const AVATAR_STORAGE_KEY = 'robloxAvatarEquipped';

const SLOT_LABELS = {
    hats: 'Hat',
    faces: 'Face',
    shirts: 'Shirt',
    pants: 'Pants',
    gear: 'Gear',
    bundles: 'Bundle',
};

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('avatarItemsGrid');
    const tabsWrap = document.getElementById('avatarTabs');
    const emptyMsg = document.getElementById('avatarItemsEmpty');
    if (!grid || !tabsWrap) return; // not on avatar.html

    const editBtn = document.querySelector('.avatar-preview-actions button:not(.secondary)');
    const randomBtn = document.querySelector('.avatar-preview-actions button.secondary');

    let equipped = loadEquipped();
    renderEquippedState();

    // --- Tabs -----------------------------------------------------
    tabsWrap.addEventListener('click', (e) => {
        const tab = e.target.closest('.avatar-tab');
        if (!tab) return;

        tabsWrap.querySelectorAll('.avatar-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.dataset.category;
        let visibleCount = 0;

        grid.querySelectorAll('.avatar-item').forEach((item) => {
            const matches = category === 'all' || item.dataset.category === category;
            item.style.display = matches ? '' : 'none';
            if (matches) visibleCount += 1;
        });

        if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    });

    // --- Equip / unequip on item click -----------------------------
    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.avatar-item');
        if (!item) return;
        e.preventDefault();

        if (item.classList.contains('avatar-item--empty')) {
            // "Add Hat / Add Face / etc." placeholder tiles
            window.alert("This is where you'd upload or link your own item image. Swap in your own catalog here!");
            return;
        }

        const category = item.dataset.category;
        const name = item.dataset.name;
        const currentlyEquipped = equipped[category] === name;

        equipped[category] = currentlyEquipped ? null : name;
        saveEquipped(equipped);
        renderEquippedState();
    });

    // --- "Try On Random" --------------------------------------------
    randomBtn?.addEventListener('click', () => {
        Object.keys(SLOT_LABELS).forEach((category) => {
            const candidates = Array.from(
                grid.querySelectorAll(`.avatar-item[data-category="${category}"]:not(.avatar-item--empty)`)
            );
            if (candidates.length === 0) return;
            // Small chance of leaving the slot empty, otherwise pick a random item
            const pickEmpty = Math.random() < 0.15;
            equipped[category] = pickEmpty
                ? null
                : candidates[Math.floor(Math.random() * candidates.length)].dataset.name;
        });
        saveEquipped(equipped);
        renderEquippedState();
    });

    // --- "Edit Avatar" — jumps down to the item grid ----------------
    editBtn?.addEventListener('click', () => {
        document.querySelector('.avatar-items-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // --- Helpers ------------------------------------------------------
    function loadEquipped() {
        try {
            const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (err) {
            // ignore corrupt/blocked storage and fall back to defaults
        }
        return { hats: null, faces: null, shirts: null, pants: null, gear: null, bundles: null };
    }

    function saveEquipped(state) {
        try {
            window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            // storage unavailable (private mode, etc.) — state just won't persist
        }
    }

    function renderEquippedState() {
        // Highlight equipped tiles in the grid
        grid.querySelectorAll('.avatar-item').forEach((item) => {
            if (item.classList.contains('avatar-item--empty')) return;
            const isEquipped = equipped[item.dataset.category] === item.dataset.name;
            item.classList.toggle('is-selected', isEquipped);
        });

        // Update the "Currently Wearing" list
        document.querySelectorAll('.avatar-equipped li[data-slot]').forEach((li) => {
            const slot = li.dataset.slot;
            const value = equipped[slot];
            const valueSpan = li.querySelector('.slot-value');
            if (valueSpan) valueSpan.textContent = value || 'None';
            li.classList.toggle('is-empty', !value);
        });
    }
});