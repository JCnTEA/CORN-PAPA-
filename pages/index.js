import { useState, useEffect } from 'react';

const vehicles = [
  { id: 1, name: 'Model 3', plate: '黑牌 8888' },
  { id: 2, name: 'Model Y', plate: '白牌 9999' },
  { id: 3, name: 'Model X', plate: '藍牌 1234' },
  { id: 4, name: 'Model S', plate: '紅牌 5678' }
];

export default function Home() {
  const [data, setData] = useState(null);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [token, setToken] = useState(null);

  const handleLogin = () => {
    window.location.href = `https://auth.tesla.com/oauth2/v3/authorize?client_id=ownerapi&response_type=token&redirect_uri=${encodeURIComponent(window.location.href)}&scope=openid+email+offline_access+vehicle_read+vehicle_control`;
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    const accessToken = hashParams.get('access_token');
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const response = await fetch('/api/tesla/charge-state', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    const switchInterval = setInterval(() => {
      setCurrentVehicleIndex((prev) => (prev + 1) % vehicles.length);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(switchInterval);
    };
  }, [token]);

  if (!token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>請先登入 Tesla 帳號以授權存取車輛資訊</h2>
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>登入 Tesla</button>
      </div>
    );
  }

  if (!data) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>載入中...</div>;
  }

  const getProgressColor = () => {
    if (data.battery_level > 50) return 'green';
    if (data.battery_level > 20) return 'orange';
    return 'red';
  };

  const circleStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: `15px solid ${getProgressColor()}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2em',
    margin: '20px auto',
    background: '#f9f9f9',
  };

  const cardStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    background: '#ffffff',
  };

  const currentVehicle = vehicles[currentVehicleIndex];

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '5px' }}>{currentVehicle.name}</h2>
      <p style={{ marginBottom: '20px', fontSize: '1em', color: '#555' }}>{currentVehicle.plate}</p>
      <div style={circleStyle}>{data.battery_level}%</div>
      <p>可行駛 {data.battery_range} 公里</p>
      <h2 style={{ color: data.charging_state === 'Charging' ? 'green' : 'gray' }}>
        {data.charging_state === 'Charging' ? `充電中 (${data.charger_power} KW)` : '未充電'}
      </h2>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        每 30 秒自動刷新與切換車輛
      </p>
    </div>
  );
}
