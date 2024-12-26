import axios from 'axios';
import md5 from 'crypto-js/md5.js';
const BASE_URL = 'https://3bic.com';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'user-agent': 'Postify/1.0.0',
    'accept': 'application/json, text/plain, */*',
  },
});

const handler = async (m, { args, conn }) => {
  const link = args[0]?.trim();

  if (!/^https?:\/\/(?:www\.)?capcut\.com\/t\/[a-zA-Z0-9_-]+\/?$/.test(link)) {
    return m.reply('❌ ¡Enlace no válido! Debe ser un enlace de una plantilla de CapCut.', m);
  }

  try {
    const time = Date.now().toString();
    const sign = md5(time + '12345678901234567890123456789012').toString();
    const kukis = `sign=${sign}; device-time=${time}`;

    const { data: { url } } = await axiosInstance.get('/api/download/get-url', {
      params: { url: link },
      headers: { Cookie: kukis },
    });

    const templateId = url.match(/template_id=(\d+)/)?.[1];
    if (!templateId) {
      return m.reply('❌ ¡ID de plantilla no encontrado!', m);
    }

    const { data } = await axiosInstance.get(`/api/download/${templateId}`, {
      headers: { Cookie: kukis },
    });

    if (data.originalVideoUrl) {
      const videoUrl = `${BASE_URL}${data.originalVideoUrl}`;
      await conn.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption: 'Hecho ✅',
        quoted: m,
      });
    } else {
      m.reply('❌ Error al obtener el video.', m);
    }
  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar la solicitud.', m);
  }
};

handler.command = ['capcut', 'cc'];
handler.tags = ['downloader'];
handler.help = ['capcut url'];
handler.limit = true;

export default handler;