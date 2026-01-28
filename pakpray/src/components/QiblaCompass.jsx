import { useState, useEffect } from 'react';

const QiblaCompass = ({ latitude, longitude }) => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [compassError, setCompassError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Calculate Qibla direction
  useEffect(() => {
    if (!latitude || !longitude) return;

    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const toRadians = (deg) => deg * Math.PI / 180;
    const toDegrees = (rad) => rad * 180 / Math.PI;

    const phi1 = toRadians(latitude);
    const phi2 = toRadians(kaabaLat);
    const lambda1 = toRadians(longitude);
    const lambda2 = toRadians(kaabaLon);

    const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
    const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
    let bearing = toDegrees(Math.atan2(y, x));

    bearing = (bearing + 360) % 360;
    setQiblaDirection(bearing);
  }, [latitude, longitude]);

  // Request permission and listen to device orientation
  const requestCompassPermission = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            setPermissionGranted(true);
          } else {
            setCompassError('Permission denied');
          }
        })
        .catch(err => setCompassError('Permission error'));
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event) => {
      let heading = null;

      if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
        heading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setDeviceHeading(heading);
        setCompassError(null);
      } else {
        setCompassError('No compass data');
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [permissionGranted]);

  const arrowRotation = qiblaDirection !== null ? qiblaDirection - deviceHeading : 0;

  return (
    <div className="mt-5 text-center">
      <h5 className="mb-3">Qibla Compass</h5>

      {!permissionGranted ? (
        <div className="mb-4">
          <p className="text-muted">Enable compass to see Qibla direction</p>
          <button className="btn btn-info btn-lg" onClick={requestCompassPermission}>
            Enable Compass
          </button>
        </div>
      ) : compassError ? (
        <div className="alert alert-warning">
          {compassError} — Try on mobile device and move in figure-8
        </div>
      ) : qiblaDirection !== null ? (
        <div>
          <div style={{
            width: '220px',
            height: '220px',
            margin: '0 auto',
            border: '3px solid #007bff',
            borderRadius: '50%',
            position: 'relative',
            background: '#f8f9fa'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '110px',
              height: '5px',
              background: 'red',
              transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
              transformOrigin: 'left center',
              borderRadius: '5px'
            }}>
              <span style={{ position: 'absolute', right: '-25px', top: '-15px', fontSize: '30px' }}>➤</span>
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold' }}>
              North ↑
            </div>
          </div>
          <p className="mt-3 fw-bold">
            Qibla: {qiblaDirection.toFixed(0)}° | Heading: {deviceHeading.toFixed(0)}°
          </p>
          <p className="text-muted small">Rotate your phone</p>
        </div>
      ) : (
        <p className="text-muted">Waiting for location</p>
      )}
    </div>
  );
};

export default QiblaCompass;