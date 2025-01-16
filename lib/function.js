const readline = require('readline');

function formatPhoneNumber(phonee) {
  let phone = String(phonee)
  if (phone.startsWith('08')) {
    return '62' + phone.substring(1) + '@s.whatsapp.net';
  }
  else if (phone.startsWith('+628')) {
    return phone.substring(1) + '@s.whatsapp.net';
  }
  else {
    return phone + '@s.whatsapp.net';
  }
} //end formatPhoneNumber

function randomNumber(length) {
  let result = '';
  const characters = '0123456789';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
} //end randomNumber

/**
 * Fungsi untuk menghapus tanda kutip (") dan titik dua (:) jika ada
 * @param {string} input - String input yang ingin diproses
 * @returns {string} String yang telah dibersihkan, atau string asli jika tidak ada perubahan
 */
function cleanString(input) {
  let cleaned = input;

  // Hapus tanda kutip jika ada
  if (cleaned.includes('"')) {
    cleaned = cleaned.replace(/"/g, '');
  }

  // Hapus bagian setelah ":" jika ada
  if (cleaned.includes(':')) {
    cleaned = cleaned.split(':')[0];
  }

  return cleaned;
}


function centerText(text) {
  const terminalWidth = process.stdout.columns; // Mendapatkan lebar terminal
  const paddingLeft = Math.floor((terminalWidth - text.length) / 2); // Menghitung spasi kiri
  const centeredText = " ".repeat(paddingLeft) + text; // Menambahkan spasi di depan teks
  return centeredText;
}
function lineText() {
  const lineLength = process.stdout.columns - 2; // Mendapatkan lebar terminal
  let line = '═'.repeat(lineLength); // Membuat garis sepanjang lebar terminal

  const position = 16; // Posisi untuk menyisipkan ╦
  if (position < lineLength) {
    // Memasukkan karakter ╦ di posisi ke-30
    line = line.slice(0, position - 1) + '╦' + line.slice(position);
  }
  line ='╔' + line;
  let before  = '═'.repeat(15);
  let hasil = '╚'+before+'╝';

  console.log(line)
  console.log(`╠═[ \x1b[1;33m\x1b[1mCONNECTED\x1b[0m ]═╣`)
  console.log(hasil)
}



module.exports = { formatPhoneNumber, randomNumber, cleanString, centerText, lineText }