fetch('/api/me', { credentials: 'same-origin' })
    .then(res => (res.ok ? res.json() : null))
    .then(user => {
        if (!user) return; // guest: show Login / Register

        const firstName = user.name.split(' ')[0];
        document.getElementById('welcome-name').textContent = firstName;
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
        document.getElementById('profile-since').textContent =
        'Member since ' + new Date(user.created_at).toLocaleDateString();

        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('user-menu').style.display = 'inline-block';
    })
.catch(() => {});

// Open/close the dropdown
const toggle = document.getElementById('user-menu-toggle');
const dropdown = document.getElementById('user-dropdown');
toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
});
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});