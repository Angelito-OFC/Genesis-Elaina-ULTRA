import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `Ingresa un link de youtube`, m, fake)
    await m.react('🕓')
  
  try {
    let api = await (await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${text}`)).json()
    let dl_url = api.data.dl

    await m.react('✅')
    await conn.sendMessage(m.chat, { video: { url: dl_url }, caption: null }, { quoted: m })
  } catch (error) {
    console.error(error)
  }
}

handler.help = ['ytmp4 *<url>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp4', 'ytv', 'fgmp4']

export default handler