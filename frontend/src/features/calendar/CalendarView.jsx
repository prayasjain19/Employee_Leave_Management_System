import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Load events from backend
  useEffect(() => {
    axios.get("/calendar")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events", err));
  }, []);

  // Get month data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startDayOfWeek = firstDay.getDay(); // Sunday=0, Monday=1
  const weeks = [];
  let dayCounter = 1 - startDayOfWeek;

  while (dayCounter <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (dayCounter > 0 && dayCounter <= daysInMonth) {
        const thisDate = new Date(year, month, dayCounter);
        const dayEvents = events.filter(
          (e) =>
            thisDate >= new Date(e.start) &&
            thisDate <= new Date(e.end)
        );
        week.push({ date: thisDate, events: dayEvents });
      } else {
        week.push(null);
      }
      dayCounter++;
    }
    weeks.push(week);
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          &lt;
        </button>
        <h2 className="text-xl font-bold">
          {monthName} {year}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 font-semibold text-center border-b pb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {weeks.flat().map((day, idx) => (
          <div
            key={idx}
            className={`h-20 p-1 border rounded relative ${
              day?.events.length ? "bg-blue-100" : ""
            }`}
          >
            {day && (
              <>
                <span className="absolute top-1 right-1 text-sm font-semibold">
                  {day.date.getDate()}
                </span>
                {day.events.length > 0 && (
                  <div className="mt-5 text-xs">
                    {day.events.map((e, i) => (
                      <div
                        key={i}
                        className="truncate text-blue-700"
                        title={`${e.title} (${e.status})`}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
