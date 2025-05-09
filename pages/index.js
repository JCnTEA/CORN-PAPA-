import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState({
    battery_level: 0,
    battery_range: 0,
    charging_state: 'Disconnected',
    charger_power: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/tesla/charge-state');
      const result = await response.json();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{data.battery_level}%</h1>
      <p>可行駛 {data.battery_range} 公里</p>
      <h2 style={{ color: data.charging_state === 'Charging' ? 'green' : 'gray' }}>
        {data.charging_state === 'Charging' ? `充電中 (${data.charger_power} KW)` : '未充電'}
      </h2>
    </div>
  );
}
