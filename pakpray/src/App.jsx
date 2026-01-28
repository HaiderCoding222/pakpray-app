import { useState, useEffect } from 'react';
import PrayerTimes from './components/PrayerTimes';
import NextPrayerCountdown from './components/NextPrayerCountdown';
import { fetchPrayerTimings } from './utils/prayerApi';
import QiblaCompass from './components/QiblaCompass';

function App() {
  const [location, setLocation] = useState(null);
  const [timings, setTimings] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState(null);

  const getLocationAndTimings = () => {
    setLoading(true);
    setError(null);
    setNextPrayer(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const fetchedTimings = await fetchPrayerTimings(latitude, longitude);
            setTimings(fetchedTimings);
            calculateNextPrayer(fetchedTimings);
          } catch (err) {
            setError('Failed to load timings');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError('Location permission denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  };

  const calculateNextPrayer = (timingsObj) => {
    const prayers = [
      { name: 'Fajr', time: timingsObj.Fajr },
      { name: 'Dhuhr', time: timingsObj.Dhuhr },
      { name: 'Asr', time: timingsObj.Asr },
      { name: 'Maghrib', time: timingsObj.Maghrib },
      { name: 'Isha', time: timingsObj.Isha },
    ];

    const now = new Date();
    let next = null;
    let minDiff = Infinity;

    prayers.forEach((prayer) => {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = new Date(now);
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime < now) prayerTime.setDate(prayerTime.getDate() + 1);

      const diff = prayerTime - now;
      if (diff < minDiff && diff > 0) {
        minDiff = diff;
        next = prayer;
      }
    });

    if (next) {
      setNextPrayer(next.name);
    }
  };

  return (
    <div className="container my-5">
      <div className="card text-center shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3>PakPray - Prayer Times</h3>
        </div>
        <div className="card-body">
          <h5 className="card-title">Today's Prayer Times</h5>

          <button
            className="btn btn-primary btn-lg mb-4"
            onClick={getLocationAndTimings}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get Prayer Times'}
          </button>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {location && (
            <div className="alert alert-info mt-3">
              Location: Lat {location.latitude.toFixed(4)} | Long {location.longitude.toFixed(4)}
            </div>
          )}

          {timings && (
            <>
              <NextPrayerCountdown nextPrayer={nextPrayer} timings={timings} />
              <PrayerTimes timings={timings} nextPrayer={nextPrayer} />
            </>
          )}
          {timings && location && (
            <QiblaCompass latitude={location.latitude} longitude={location.longitude} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;