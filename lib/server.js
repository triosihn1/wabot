require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

/**
 * TIME ZONE
 */
 const now = new Date();
 const jakartaOffset = 7 * 60 * 60 * 1000; // 7 jam dalam milidetik
 const jakartaTime = new Date(now.getTime() + jakartaOffset);
 const timestamp = jakartaTime.getTime();
// Path ke file config.json
const configPath = path.join(__dirname, '../json/config.json');
//path ke folder session
const sessionPath = path.join(__dirname, '../session');
// Konfigurasi Firebase menggunakan Service Account Key
//const serviceAccount = require('../json/firebase.json');

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString('utf-8'));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.URL_FIREBASE,
});

const db = admin.database();

/**
 * Fungsi utama untuk mengelola log dan status bot di Firebase
 * @param {string} action - Aksi yang ingin dilakukan ("status", "log", "get" atau "reset")
 * @param {number|string} number - Nomor bot (bisa string atau angka)
 * @param {string|object} data - Data tambahan untuk aksi (status baru atau data log)
 */
function server(action, number, data) {
  const num = Number(number); // Konversi nomor menjadi angka
  //const timestamp = new Date().toISOString(); // Menggunakan waktu UTC

  if (action === 'reset') {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(sessionPath)) {
          // Membaca daftar file di dalam folder session
          const files = fs.readdirSync(sessionPath); // Gunakan readdirSync untuk membaca daftar file
          
          // Cek apakah ada file bernama session-${number}
          const hasSessionFile = files.some(file => file.startsWith(`session-${number}`));
          
          // Jika tidak ada file bernama session-${number}, hapus folder session
          if (!hasSessionFile) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            console.log(`[ \x1b[1;33m\x1b[1mDELETE\x1b[0m ][ \x1b[0;35m${sessionPath}\x1b[0m ][ \x1b[0;32mSUCCESS\x1b[0m ]`);
            resolve({ status: true });
          } else {
            resolve({ status: false });
          }
        } else {
          console.log(`[ \x1b[1;33m\x1b[1mSESSION\x1b[0m ][ \x1b[0;35m${sessionPath}\x1b[0m ][ \x1b[0;31mNOT FOUND\x1b[0m ]`);
          resolve({ status: false });
        }
      } catch (error) {
        console.error(`[ \x1b[1;33m\x1b[1mDELETE\x1b[0m ][ \x1b[0;31mERROR\x1b[0m ][ \x1b[0;35m${error.message}\x1b[0m ]`);
        reject(error);
      }
    });
  }
  
  if (action === 'get') {
    // Aksi untuk mengambil data dari file config.json
    try {
      if (!fs.existsSync(configPath)) {
        throw new Error('File config.json tidak ditemukan.');
      }
      
      const configData = fs.readFileSync(configPath, 'utf-8');
      if (!configData || configData === 'null' || configData === 'undefined') {
        throw new Error('File config.json kosong atau tidak valid.');
      }

      const parsedData = JSON.parse(configData);
      if (parsedData.number !== num) {
        throw new Error(`Data untuk nomor ${number} tidak ditemukan di config.json.`);
      }

      console.log(`[ \x1b[1;33m\x1b[1mCONFIG\x1b[0m ][ \x1b[0;35m${number}\x1b[0m ][ \x1b[0;32mDATA FOUND\x1b[0m ]`);
      return Promise.resolve(parsedData);
    } catch (error) {
      console.error(`[ \x1b[1;33m\x1b[1mCONFIG\x1b[0m ][ \x1b[0;31mERROR\x1b[0m ][ \x1b[0;35m${error.message}\x1b[0m ]`);
      return Promise.reject(error);
    }
  }

  return db.ref('server_data/bot_data').once('value')
    .then((snapshot) => {
      const botData = snapshot.val() || {}; // Ambil data bot_data
      let botId = null;

      // Cari bot berdasarkan nomor
      for (const key in botData) {
        if (botData[key].number === num) {
          botId = key;
          break;
        }
      }

      if (!botId) {
        throw new Error(`No ${number} Tidak Ada`);
      }

      // Aksi berdasarkan jenis action
      if (action === 'status') {
        const botRef = db.ref(`server_data/bot_data/${botId}`);
        return botRef.update({ 
          status: data, 
          lastUpdated: timestamp // Menambahkan waktu UTC saat status diubah
        })
          .then(() => {
            console.log(`[ \x1b[1;33m\x1b[1mFIREBASE\x1b[0m ][ \x1b[0;35m${number}\x1b[0m ][ \x1b[0;32m${data}\x1b[0m ]`);
            return db.ref('server_data/bot_data').once('value');
          })
          .then((snapshot) => {
            const allBotData = snapshot.val() || {};
            // Simpan botServerData ke config.json
            if (data === "Online") {
              fs.writeFileSync(configPath, JSON.stringify(allBotData[botId], null, 2), 'utf-8');
              console.log(`[ \x1b[1;33m\x1b[1mCONFIG\x1b[0m ][ \x1b[0;32mSAVED\x1b[0m ]`);
            }
          });
      } else if (action === 'log') {
        // Tambahkan log ke bot
        const logId = generateRandomId();
        const logRef = db.ref(`server_data/bot_data/${botId}/logs/${logId}`);
        return logRef.set({
          ...data,
          id: logId,
          timestamp: admin.database.ServerValue.TIMESTAMP, // Gunakan waktu server Firebase
        })
          .then(() => {
            console.log(`[ \x1b[1;33m\x1b[1mFIREBASE\x1b[0m ][ \x1b[0;35m${number}\x1b[0m ][ \x1b[0;31mLOG\x1b[0m ]`);
          });
      } else {
        throw new Error(`Aksi "${action}" tidak valid. Gunakan "status", "log", atau "get" atau "reset".`);
      }
    })
    .catch((error) => {
      console.error(`[ \x1b[1;33m\x1b[1mFIREBASES\x1b[0m ][ \x1b[0;31mERROR\x1b[0m ][ \x1b[0;35m${error.message}\x1b[0m ]`);
    });
}

/**
 * Fungsi untuk menghasilkan ID acak
 * @returns {string} ID acak
 */
function generateRandomId() {
  return Math.random().toString(36).substring(2, 10); // ID acak berbasis angka dan huruf
}

// Export fungsi-fungsi
module.exports = { server };