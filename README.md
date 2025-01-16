<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ScriptKu Bot</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f9f9f9;
      color: #333;
    }
    h1, h2 {
      text-align: center;
      color: #2c3e50;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    p {
      margin-bottom: 15px;
    }
    code, pre {
      background: #eef2f7;
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 1rem;
    }
    pre {
      overflow-x: auto;
      display: block;
    }
    .endpoint {
      margin: 20px 0;
      border-left: 4px solid #007bff;
      padding-left: 15px;
    }
    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    li {
      margin-bottom: 10px;
    }
    footer {
      text-align: center;
      margin-top: 30px;
      color: #555;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ScriptKu Bot</h1>
    <h2>Panduan API</h2>
    <p>
      Selamat datang di <strong>ScriptKu Bot</strong>. Platform ini menyediakan layanan API yang dirancang untuk mempermudah pengiriman pesan otomatis melalui WhatsApp. Berikut adalah penjelasan lengkap mengenai cara menggunakan API kami.
    </p>
    
    <h3>Base URL</h3>
    <p>Semua permintaan API dimulai dengan base URL berikut:</p>
    <pre>https://bubbly-warmth-production.up.railway.app</pre>
    
    <h3>Endpoint API</h3>
    
    <div class="endpoint">
      <h4>1. Auth</h4>
      <p>Gunakan endpoint <code>auth/:type</code> untuk melakukan autentikasi. Endpoint ini menerima parameter berikut:</p>
      <ul>
        <li><strong>phone</strong>: Nomor WhatsApp tanpa tanda "+" (contoh: <code>6281234567890</code>).</li>
      </ul>
      <p>Respon sukses:</p>
      <pre>
{
  "status": true,
  "result": "KPW9LKQU"
}
      </pre>
    </div>
    
    <div class="endpoint">
      <h4>2. Text</h4>
      <p>Gunakan endpoint ini untuk mengirim pesan teks biasa. Parameter yang diperlukan:</p>
      <ul>
        <li><strong>phone</strong>: Nomor WhatsApp tujuan.</li>
        <li><strong>message.text</strong>: Konten pesan teks.</li>
      </ul>
    </div>
    
    <div class="endpoint">
      <h4>3. Copy</h4>
      <p>Endpoint ini digunakan untuk mengirim tombol salin ("copy") ke WhatsApp. Parameter yang diperlukan:</p>
      <ul>
        <li><strong>phone</strong>: Nomor WhatsApp tujuan.</li>
        <li><strong>message.text</strong>: Konten pesan teks.</li>
        <li><strong>message.otp</strong>: Kode OTP.</li>
      </ul>
    </div>
    
    <div class="endpoint">
      <h4>4. URL</h4>
      <p>Endpoint ini digunakan untuk mengirim tautan URL ke WhatsApp. Parameter yang tersedia:</p>
      <ul>
        <li><strong>Tanpa Gambar:</strong></li>
        <ul>
          <li><strong>phone</strong>: Nomor WhatsApp tujuan.</li>
          <li><strong>message.text</strong>: Konten pesan teks.</li>
          <li><strong>message.url</strong>: URL tujuan.</li>
        </ul>
        <li><strong>Dengan Gambar:</strong></li>
        <ul>
          <li><strong>phone</strong>: Nomor WhatsApp tujuan.</li>
          <li><strong>message.text</strong>: Konten pesan teks.</li>
          <li><strong>message.url</strong>: URL tujuan.</li>
          <li><strong>message.image</strong>: URL gambar yang ingin dikirim.</li>
        </ul>
      </ul>
    </div>
  </div>
  <footer>
    &copy; 2025 ScriptKu. Semua hak dilindungi.
  </footer>
</body>
</html>