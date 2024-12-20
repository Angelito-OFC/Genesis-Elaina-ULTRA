import uploadFile from '../lib/uploadFile.js'
import { uploadToPomf2 } from '../lib/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let pp = await conn.profilePictureUrl(who).catch(_ => global.pic)
let name = await conn.getName(who)
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw 'No media found'
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadToPomf2 : uploadFile)(media)
  let caption = `📮 *L I N K :*
${link}
📊 *S I Z E :* ${media.length} Byte
📛 *E x p i r e d :* ${isTele ? 'No Expiry Date' : 'Unknown'}

*S H O R T :* ${await shortUrl(link)}`

conn.reply(m.chat, caption, m, { contextInfo: {
          externalAdReply :{
    mediaUrl: canal,
    mediaType: 2,
    title: wm,
    body: packname,
    thumbnail: await(await fetch(link)).buffer(),
    sourceUrl: link
     }}
  })
}
handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl|upload)$/i
export default handler

async function shortUrl(url) {
	let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
	return await res.text()
}
