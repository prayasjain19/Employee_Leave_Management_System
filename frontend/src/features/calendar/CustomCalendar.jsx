import React, { useEffect, useState } from 'react';
import { fetchEvents } from './calendarApi';

/**
 * Small custom monthly grid calendar.
 * Shows days and events (from backend /calendar).
 */
const weekdayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CustomCalendar() {
  const [events, setEvents] = useState([]);
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dayHasEvents = (date) => events.filter(e => {
    const s = new Date(e.start);
    const eD = new Date(e.end);
    // inclusive
    return date >= s && date <= eD;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="btn-ghost px-3 py-1 rounded">Prev</button>
        <div className="text-lg font-semibold">{current.toLocaleString('default',{month:'long'})} {year}</div>
        <button onClick={nextMonth} className="btn-ghost px-3 py-1 rounded">Next</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-1">
        {weekdayNames.map(w => <div key={w} className="text-xs text-gray-500">{w}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((date, idx) => {
          if (!date) return <div key={idx} className="h-28"></div>;
          const dayEvents = dayHasEvents(date);
          return (
            <div key={idx} className={`calendar-day ${dayEvents.length ? 'has-event' : ''}`}>
              <div className="text-sm font-medium">{date.getDate()}</div>
              <div className="mt-2 space-y-1 text-xs">
                {dayEvents.slice(0,3).map((ev,i) => (
                  <div key={i} className={`event-pill ${ev.status === 'Approved' ? 'bg-green-100 text-green-800' : ev.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length-3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
