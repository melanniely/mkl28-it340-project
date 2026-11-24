fetch('/api/me', { credentials: 'same-origin' })
    .then(res => (res.ok ? res.json() : null))
    .then(user => {
        if (!user) return; // guest: leave the defaults
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
        document.getElementById('profile-since').textContent =
        'Member since ' + new Date(user.created_at).toLocaleDateString();

        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('nav-logout').style.display = 'inline';
    })
.catch(() => {});