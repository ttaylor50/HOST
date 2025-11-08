import React, { useEffect, useState } from 'react';
import Chatbot from './Chatbot';
import CalendarGrid from './CalendarGrid';
import './Dashboard.css';

const Dashboard = () => {
  const [tab, setTab] = useState('tracker');
  const [dates, setDates] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) return;
    const fetchCalendar = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/calendar/${username}`);
        if (res.ok) {
          const data = await res.json();
          setDates(data.dates || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCalendar();
  }, [username]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-inner">
          <img src="/favicon.ico" alt="logo" className="logo" />
          <h1 className="title">HopeAI Assistant</h1>
          <div className="spacer" />
          <div className="user-badge">{username || 'Guest'}</div>
        </div>
      </header>

      <div className="content-wrap">
        <aside className="side-tabs">
          <button onClick={() => setTab('tracker')} className={tab === 'tracker' ? 'active' : ''}>Tracker</button>
          <button onClick={() => setTab('chatbot')} className={tab === 'chatbot' ? 'active' : ''}>Chatbot</button>
        </aside>

        <main className="main-card">
          {tab === 'tracker' && <CalendarGrid dates={dates} />}
          {tab === 'chatbot' && <Chatbot />}
        </main>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} HopeAI</span>
          <nav className="footer-links">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Help</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
