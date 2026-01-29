export const fetchPrayerTimings = async (latitude, longitude) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.code === 200) {
    return data.data.timings;
  } else {
    throw new Error('API failed: ' + data.status);
  }
};