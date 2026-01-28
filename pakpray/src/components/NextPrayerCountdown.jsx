import { useState, useEffect } from 'react';

const NextPrayerCountdown = ({ nextPrayer, timings }) => {
  const [countdown, setCountdown] = useState('');

  const updateCountdown = () => {
    if (!nextPrayer || !timings) return;

    const timeStr = timings[nextPrayer];
    if (!timeStr) return;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setHours(hours, minutes, 0, 0);

    if (nextDate < now) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const diffMs = nextDate - now;
    const minutesLeft = Math.floor(diffMs / 60000);
    const hoursLeft = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;

    const text = hoursLeft > 0 
      ? `${hoursLeft} hours ${mins} minutes` 
      : `${mins} minutes`;

    setCountdown(`${nextPrayer} in ${text}`);
  };

  useEffect(() => {
    if (nextPrayer && timings) {
      updateCountdown();
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    }
  }, [nextPrayer, timings]);

  if (!nextPrayer || !countdown) return null;

  return (
    <div className="alert alert-warning mb-4 text-center">
      <strong>Next Prayer: {countdown}</strong>
    </div>
  );
};

export default NextPrayerCountdown;