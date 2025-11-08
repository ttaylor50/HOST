import os
import sqlite3
from typing import Optional, List
from datetime import date

DB_PATH = os.path.join(os.path.dirname(__file__), 'app.db')


def get_conn():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        location TEXT,
        email TEXT,
        expert INTEGER DEFAULT 0
    )
    ''')
    cur.execute('''
    CREATE TABLE IF NOT EXISTS logins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        UNIQUE(user_id, date),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    ''')
    conn.commit()
    conn.close()


def create_user(username: str, password: str, location: Optional[str], email: Optional[str], expert: bool) -> dict:
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, password, location, email, expert) VALUES (?, ?, ?, ?, ?)",
            (username, password, location, email, int(bool(expert)))
        )
        conn.commit()
        user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        conn.close()
        raise
    user = get_user_by_id(user_id)
    conn.close()
    return user


def get_user_by_username(username: str) -> Optional[dict]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[dict]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def record_login(user_id: int, on_date: Optional[date] = None) -> None:
    if on_date is None:
        on_date = date.today()
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute("INSERT OR IGNORE INTO logins (user_id, date) VALUES (?, ?)", (user_id, on_date.isoformat()))
        conn.commit()
    finally:
        conn.close()


def get_login_dates(user_id: int) -> List[str]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT date FROM logins WHERE user_id = ? ORDER BY date", (user_id,))
    rows = cur.fetchall()
    conn.close()
    return [r['date'] for r in rows]
