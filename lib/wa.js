const {
  default: makeWASocket,
  DisconnectReason,
  makeInMemoryStore,
  jidDecode,
  proto,
  getContentType,
  useMultiFileAuthState,
  downloadContentFromMessage,
  generateWAMessageContent,
  generateWAMessageFromContent
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const readline = require('readline');
const PhoneNumber = require('awesome-phonenumber');
const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
});

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(text, resolve);
  });
};

async function starts() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  });

  // if (!sock.authState.creds.registered) {
  //   const phoneNumber = await question(
  //     '𝙼𝚊𝚜𝚞𝚔𝚊𝚗 𝙽𝚘𝚖𝚎𝚛 𝚈𝚊𝚗𝚐 𝙰𝚔𝚝𝚒𝚏 𝙰𝚠𝚊𝚕𝚒 𝙳𝚎𝚗𝚐𝚊𝚗 𝟼𝟸 :\n',
  //   );
  //   let code = await sock.requestPairingCode(phoneNumber);
  //   code = code?.match(/.{1,4}/g)?.join('-') || code;
  //   console.log(`𝙲𝙾𝙳𝙴 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 :`, code);
  // }

  store.bind(sock.ev);

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message =
        Object.keys(mek.message)[0] === 'ephemeralMessage'
          ? mek.message.ephemeralMessage.message
          : mek.message;
      if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
      
      m = smsg(sock, mek, store);
     if (m.isBot) return;
      const { type, quotedMsg, mentioned, now, fromMe } = m;
      var body =
        m.mtype === 'conversation'
          ? m.message.conversation
          : m.mtype == 'imageMessage'
            ? m.message.imageMessage.caption
            : m.mtype == 'videoMessage'
              ? m.message.videoMessage.caption
              : m.mtype == 'extendedTextMessage'
                ? m.message.extendedTextMessage.text
                : m.mtype == 'buttonsResponseMessage'
                  ? m.message.buttonsResponseMessage.selectedButtonId
                  : m.mtype == 'listResponseMessage'
                    ? m.message.listResponseMessage.singleSelectReply
                        .selectedRowId
                    : m.mtype == 'templateButtonReplyMessage'
                      ? m.message.templateButtonReplyMessage.selectedId
                      : m.mtype === 'messageContextInfo'
                        ? m.message.buttonsResponseMessage?.selectedButtonId ||
                          m.message.listResponseMessage?.singleSelectReply
                            .selectedRowId ||
                          m.text
                        : '';
      var budy = typeof m.text == 'string' ? m.text : '';
      global.prefa = [''];
      global.d = new Date();
      global.calender = d.toLocaleDateString('id');
      const prefix = prefa
        ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
          ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
          : ''
        : (prefa ?? global.prefix);
      const isCmd = body.startsWith(prefix);
      const command = isCmd
        ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase()
        : '';
      const args = body.trim().split(/ +/).slice(1);
      const text = (q = args.join(' '));
      const sender = m.key.fromMe
        ? sock.user.id.split(':')[0] + '@s.whatsapp.net' || sock.user.id
        : m.key.participant || m.key.remoteJid;
      const botNumber = await sock.decodeJid(sock.user.id);
      const senderNumber = sender.split('@')[0];
      const quoted = (q = m.quoted ? m.quoted : m);
      const groupMetadata = m.isGroup
        ? await sock.groupMetadata(m.chat).catch((e) => {})
        : '';
      const groupName = m.isGroup ? groupMetadata.subject : '';
      const participants = m.isGroup ? await groupMetadata.participants : '';
      const pushname = m.pushName || `${senderNumber}`;

      const reply = (teks) => {
        sock.sendMessage(
          m.chat,
          {
            text: teks
          },
          { quoted: m },
        );
      };
      const from = m.chat;

      if (command) {
        console.log(
          `${m.isGroup ? '\x1b[0;32mGC\x1b[1;32m-CMD' : '\x1b[1;32m MESSAGE'} \x1b[0m[ \x1b[1;37m${command} \x1b[0m] at \x1b[0;32m${calender}\x1b[0m\n› ${m.chat}\n› from; \x1b[0;37m${sender.split('@')[0]}\x1b[0m${m.pushName ? ', ' + m.pushName : ''}\n› in; \x1b[0;32m${m.isGroup ? groupName : 'PRIVATE MESSAGE'}\x1b[0m`,
        );
      }
      switch (command) {
      case 'tes':
      reply('pong')
      break
      case 'copy':
      sock.sendButton(m.chat, "Function send button copy", [{
        "name": "cta_copy",
        "buttonParamsJson": `{
        display_text: "Copy code",
        id: "123456789",
        copy_code: "tes"
        }`
    }], "Copy text bellow", {}) // buat no thumbnail 
      break
      case 'url':
      sock.sendButton(m.chat, "Function send button url", [{
        "name": "cta_url",
        "buttonParamsJson": `{
        display_text: "Click",
        url: "https://google.com",
        merchant: "https://google.com"
        }`
    }], "Click url bellow", {header: 'tes', thumbnail: 'https://cdn.tioxy.xyz/file/file-1734091944366.jpg'}) // buat make thumbnail 
      break
        default:
  }
} catch (e) {
console.log(e)
}
});

  sock.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user && decode.server && decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };
  sock.sendText = (jid, text, quoted = '', options) => {
  sock.sendMessage(jid, { text: text, ...options }, { quoted });
}
  sock.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype
      ? message.mtype.replace(/Message/gi, '')
      : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };
  // send button 
  sock.sendButton = async (jid, text, row = [], footer, opts = {}) => {
    async function createImage(url) {
        const { imageMessage } = await generateWAMessageContent(
            { image: { url } },
            { upload: sock.waUploadToServer }
        );
        return imageMessage;
    }

    let header = null;

    if (opts.thumbnail) {
        const imageMessage = await createImage(opts.thumbnail);
        header = proto.Message.InteractiveMessage.Header.create({
            title: opts.header || "",
            hasMediaAttachment: true,
            imageMessage: imageMessage,
        });
    }

    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: text,
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        text: footer,
                    }),
                    header: header, 
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [...row],
                    }),
                }),
            },
        },
    }, {});
    return sock.relayMessage(jid, msg.message, {
        messageId: msg.key.id,
    });
    //return msg;
};


  sock.serializeM = (m) => smsg(sock, m, store);
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (
        reason === DisconnectReason.badSession ||
        reason === DisconnectReason.connectionClosed ||
        reason === DisconnectReason.connectionLost ||
        reason === DisconnectReason.connectionReplaced ||
        reason === DisconnectReason.restartRequired ||
        reason === DisconnectReason.timedOut
      ) {
        starts();
      } else if (reason === DisconnectReason.loggedOut) {
      } else {
        sock.end(`Unknown DisconnectReason: ${reason}|${connection}`);
      }
    } else if (connection === 'open') {
      console.log('[Connected] ' + JSON.stringify(sock.user.id, null, 2));
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

starts();

function smsg(sock, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBot = (m.id.startsWith('3EB0') || m.id.startsWith('TIXO') || m.id.length === 22 || false);
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat.endsWith('@g.us');
    m.sender = sock.decodeJid(
      (m.fromMe && sock.user.id) ||
        m.participant ||
        m.key.participant ||
        m.chat ||
        '',
    );
    if (m.isGroup) m.participant = sock.decodeJid(m.key.participant) || '';
  }
  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg =
      m.mtype == 'viewOnceMessage'
        ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
        : m.message[m.mtype];
    m.body =
      m.message.conversation ||
      m.msg.caption ||
      m.msg.text ||
      (m.mtype == 'listResponseMessage' &&
        m.msg.singleSelectReply.selectedRowId) ||
      (m.mtype == 'buttonsResponseMessage' && m.msg.selectedButtonId) ||
      (m.mtype == 'viewOnceMessage' && m.msg.caption) ||
      m.text;
    let quoted = (m.quoted = m.msg.contextInfo
      ? m.msg.contextInfo.quotedMessage
      : null);
    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
    if (m.quoted) {
      let type = getContentType(quoted);
      m.quoted = m.quoted[type];
      if (['productMessage'].includes(type)) {
        type = getContentType(m.quoted);
        m.quoted = m.quoted[type];
      }
      if (typeof m.quoted === 'string')
        m.quoted = {
          text: m.quoted,
        };
      m.quoted.mtype = type;
      m.quoted.id = m.msg.contextInfo.stanzaId;
      m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
      m.quoted.isBaileys = m.quoted.id
        ? m.quoted.id.startsWith('3EB0') && m.quoted.id.length === 16
        : false;
      m.quoted.sender = sock.decodeJid(m.msg.contextInfo.participant);
      m.quoted.fromMe = m.quoted.sender === sock.decodeJid(sock.user.id);
      m.quoted.text =
        m.quoted.text ||
        m.quoted.caption ||
        m.quoted.conversation ||
        m.quoted.contentText ||
        m.quoted.selectedDisplayText ||
        m.quoted.title ||
        '';
      m.quoted.mentionedJid = m.msg.contextInfo
        ? m.msg.contextInfo.mentionedJid
        : [];
      m.getQuotedObj = m.getQuotedMessage = async () => {
        if (!m.quoted.id) return false;
        let q = await store.loadMessage(m.chat, m.quoted.id, conn);
        return exports.smsg(conn, q, store);
      };
      let vM = (m.quoted.fakeObj = M.fromObject({
        key: {
          remoteJid: m.quoted.chat,
          fromMe: m.quoted.fromMe,
          id: m.quoted.id,
        },
        message: quoted,
        ...(m.isGroup ? { participant: m.quoted.sender } : {}),
      }));
      m.quoted.delete = () =>
        sock.sendMessage(m.quoted.chat, { delete: vM.key });
      m.quoted.copyNForward = (jid, forceForward = false, options = {}) =>
        sock.copyNForward(jid, vM, forceForward, options);
      m.quoted.download = () => sock.downloadMediaMessage(m.quoted);
    }
  }
  if (m.msg.url) m.download = () => sock.downloadMediaMessage(m.msg);
  m.text =
    m.msg.text ||
    m.msg.caption ||
    m.message.conversation ||
    m.msg.contentText ||
    m.msg.selectedDisplayText ||
    m.msg.title ||
    '';
  m.reply = (text, chatId = m.chat, options = {}) =>
    Buffer.isBuffer(text)
      ? sock.sendMedia(chatId, text, 'file', '', m, { ...options })
      : sock.sendText(chatId, text, m, { ...options });
  m.copy = () => exports.smsg(conn, M.fromObject(M.toObject(m)));
  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) =>
    sock.copyNForward(jid, m, forceForward, options);

  return m;
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});

module.exports = { starts }