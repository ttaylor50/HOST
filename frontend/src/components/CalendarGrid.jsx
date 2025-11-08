import React from 'react';
import './CalendarGrid.css';

// Modern month grid showing days of current month and highlights when date in `dates` prop
const CalendarGrid = ({ dates = [] }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const dateSet = new Set(dates);

  const cells = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    const logged = dateSet.has(iso);
    cells.push({ day: d, iso, logged });
  }

  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <h2 className="calendar-title">{today.toLocaleString(undefined, { month: 'long' })} {year}</h2>
        <div className="calendar-sub">Daily sign-in tracker</div>
      </div>

      <div className="calendar-grid" role="grid" aria-label="Monthly login grid">
        {cells.map((c) => (
          <div key={c.iso} title={c.iso} className={`cell ${c.logged ? 'logged' : ''}`}>
            <span className="cell-number">{c.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CalendarGrid;
