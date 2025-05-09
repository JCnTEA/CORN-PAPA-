import { useState, useEffect } from 'react';

const vehicles = [
  { id: 1, name: 'Model 3' },
  { id: 2, name: 'Model Y' }
];

export default function Home() {
  const [data, setData] = useState({
    battery_level: 0,
    battery_range: 0,
    charging_state: 'Disconnected',
    charger_power: 0,
  });
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/tesla/charge-state');
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
  }, []);

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

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '20px' }}>{vehicles[currentVehicleIndex].name}</h2>
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
