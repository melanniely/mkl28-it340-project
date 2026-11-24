const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: false }
}));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
        return res.status(400).send('Invalid input');
    }
    try {
        const hash = await bcrypt.hash(password, 12);
        // "?" placeholders = parameterized query, which prevents SQL injection
        await db.execute(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        [name, email.toLowerCase(), hash]
        );
        console.log(`Register OK email=${email}`);
        res.redirect('/login.html');
    } catch (e) {
        console.log(`Register failed email=${email} reason=${e.code}`);
        res.status(409).send('Could not register');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('Invalid input');
    try {
        const [rows] = await db.execute(
        'SELECT id, name, password_hash FROM users WHERE email = ?',
        [email.toLowerCase()]
        );
        const ok = rows.length && await bcrypt.compare(password, rows[0].password_hash);
        if (!ok) {
            console.log(`Login FAILED email=${email}`);
            return res.status(401).send('Invalid credentials');
        }
        req.session.userId = rows[0].id;
        console.log(`Login OK user=${rows[0].id}`);
        res.redirect('/index.html');
    } catch (e) {
        console.log(`Login error: ${e.code}`);
        res.status(500).send('Server error');
    }
});

app.listen(3000, '10.10.10.20', () => console.log('Backend listening on 10.10.10.20:3000'));