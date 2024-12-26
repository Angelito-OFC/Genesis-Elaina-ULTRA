import yts from 'yt-search';
const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Por favor ingresa un texto*\nEjemplo:\n${usedPrefix + command} https://youtu.be/QSvaCSt8ixs`;

  const isVideo = /vid|2|mp4|v$/.test(command);
  const search = await yts(text);

  if (!search.all || search.all.length === 0) {
    throw "No se encontraron resultados para tu búsqueda.";
  }

  const videoInfo = search.all[0];
  const body = `*Youtube By CrowBot*

    • *Título :* » ${videoInfo.title}
    • *Views :* » ${videoInfo.views}
    • *Duration :* » ${videoInfo.timestamp}
    • *Uploaded :* » ${videoInfo.ago}
    • *URL :* » ${videoInfo.url}`;

m.react(🕓)
  conn.sendMessage(m.chat, {
    image: { url: videoInfo.thumbnail },
    caption: body,
  }, { quoted: m });

m.react(✅)
  let result;
  try {
    if (command === 'play' || command === 'yta' || command === 'ytmp3') {
      let hh = await fetch(`https://api.siputzx.my.id/api/dl/youtube/mp3?url=${videoInfo.url}`);
      result = await hh.json()
    } else if (command === 'playvid' || command === 'ytv' || command === 'play2' || command === 'ytmp4') {
    let rr = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp4?url=${videoInfo.url}`);
      result = await rr.json()
    } else {
      throw "Comando no reconocido.";
    }
let url_dl = isVideo ? result.data.download.url : result.data
    conn.sendMessage(m.chat, {
      [isVideo ? 'video' : 'audio']: { url: url_dl },
      mimetype: isVideo ? "video/mp4" : "audio/mpeg",
      caption: isVideo ? `URL: ${videoInfo.url}` : '',
    }, { quoted: m });

  } catch (error) {
m.react('✖️')
    throw "error";
  }
};

handler.command = handler.help = ['yta', 'ytmp3', 'Ytmp3'];
handler.tags = ['descargas'];
handler.estrellas = 4;

export default handler;

const getVideoId = (url) => {
  const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  throw new Error("Invalid YouTube URL");
};


/* import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `🤍 Ingresa un link de youtube`, m)
    await m.react('🕓')
  
  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${text}`)).json()
    let dl_url = api.data.dl
    let title = api.data.title

    await m.react('✅')
    await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m })
  } catch (error) {
    console.error(error)
  }
}

handler.help = ['ytmp3 *<url>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta', 'fgmp3']

export default handler */
