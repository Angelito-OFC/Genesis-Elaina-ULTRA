import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❀ Ingresa un link de youtube`, m)
    await m.react('🕓')
  
  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${text}`)).json()
    let dl_url = api.data.dl
    let title = api.data.title  // Aquí extraemos el título

    await m.react('✅')
    await conn.sendMessage(m.chat, { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m })
  } catch (error) {
    console.error(error)
  }
}

handler.help = ['ytmp3 *<url>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta', 'fgmp3']

export default handler
