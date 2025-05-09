import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [countdown, setCountdown] = useState(60);

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
    const dataInterval = setInterval(fetchData, 10000);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(countdownInterval);
    };
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
          <li>2. 登入後進入 "Account -> Tesla API Token" 頁面。</li>
          <li>3. 參考以下圖示：[插入 TeslaFi 介面截圖位置說明]</li>
          <li>4. 複製顯示的 Access Token 並貼上至授權欄位。</li>
        </ol>
        <p>API 端點：/api/tesla/charge-state-latest<br />
        請求方法：GET<br />
        回應格式：<br />
        {'{'}<br />
        &nbsp;&nbsp;"vehicle_name": "Model 3",<br />
        &nbsp;&nbsp;"plate": "黑牌 8888",<br />
        &nbsp;&nbsp;"battery_level": 76,<br />
        &nbsp;&nbsp;"battery_range": 356.2,<br />
        &nbsp;&nbsp;"charging_state": "Charging",<br />
        &nbsp;&nbsp;"charger_power": 7<br />
        {'}'}
        </p>
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
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'red' }}>
        {countdown} 秒後自動返回首頁
      </p>
    </div>
  );
}
