import { useState, useEffect } from 'react';

const PrayerTimes = ({ timings, nextPrayer, countdown }) => {
  if (!timings) return null;

  return (
    <div className="mt-4">
      {nextPrayer && countdown && (
        <div className="alert alert-warning mb-4 text-center">
          <strong>Next Prayer: {countdown}</strong>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Prayer</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
            <tr
              key={prayer}
              className={prayer === nextPrayer ? 'table-success fw-bold' : ''}
            >
              <td>{prayer}</td>
              <td>{timings[prayer] || timings.Dhuhr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrayerTimes;