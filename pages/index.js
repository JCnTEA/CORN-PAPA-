import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tesla_token');
    if (token) {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      const response = await fetch('/api/tesla/charge-state-latest');
      const result = await response.json();
      setData(result);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const handleTokenSubmit = (event) => {
    event.preventDefault();
    const token = event.target.elements.token.value;
    if (token) {
      localStorage.setItem('tesla_token', token);
      setIsAuthorized(true);
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>如何取得 Tesla API Token</h2>
        <ol style={{ textAlign: 'left', display: 'inline-block', textAlign: 'left', marginBottom: '20px' }}>
          <li>1. 前往 <a href="https://www.teslafi.com/signup.php" target="_blank" rel="noopener noreferrer">TeslaFi</a> 註冊並登入 Tesla 帳號。</li>
          <li>2. 登入後進入 TeslaFi 帳戶設定頁，找到 Tesla API Token。</li>
          <li>3. 複製你的 Tesla API Token。</li>
          <li>4. 回到本頁貼上 Token 並點擊確認授權。</li>
        </ol>
        <form onSubmit={handleTokenSubmit}>
          <input
            type="text"
            name="token"
            placeholder="請貼上 Tesla API Token"
            style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
          />
          <br />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
            確認授權
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>等待授權連線中...</div>;
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

  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: '5px' }}>{data.vehicle_name || 'Tesla 車輛'}</h2>
      <p style={{ marginBottom: '20px', fontSize: '1em', color: '#555' }}>{data.plate || '未提供車牌'}</p>
      <div style={circleStyle}>{data.battery_level}%</div>
      <p>可行駛 {data.battery_range} 公里</p>
      <h2 style={{ color: data.charging_state === 'Charging' ? 'green' : 'gray' }}>
        {data.charging_state === 'Charging' ? `充電中 (${data.charger_power} KW)` : '未充電'}
      </h2>
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        實時監控中，最近更新時間：{new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
