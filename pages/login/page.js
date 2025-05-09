
import { useState } from 'react';
import QRCode from 'qrcode.react';

export default function Login() {
  const [token, setToken] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      localStorage.setItem('tesla_token', token);
      window.location.href = '/public';
    }
  };

  const teslaFiLink = 'https://www.teslafi.com/signup.php';

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>如何取得 Tesla API Token</h2>
      <ol style={{ textAlign: 'left', display: 'inline-block', textAlign: 'left', marginBottom: '20px' }}>
        <li>1. 點擊下方按鈕或掃描 QR Code 進入 TeslaFi 登入頁</li>
        <li>2. 登入 Tesla 帳號</li>
        <li>3. 複製你的 Tesla API Token 並貼到下方</li>
      </ol>

      <button onClick={() => setShowQR(!showQR)} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        {showQR ? '隱藏 QR Code' : '顯示 QR Code'}
      </button>

      {showQR && (
        <div style={{ marginBottom: '20px' }}>
          <QRCode value={teslaFiLink} size={200} />
          <p><a href={teslaFiLink} target="_blank" rel="noopener noreferrer">或點此前往 TeslaFi</a></p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="請貼上 Tesla API Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>確認授權</button>
      </form>
    </div>
  );
}
