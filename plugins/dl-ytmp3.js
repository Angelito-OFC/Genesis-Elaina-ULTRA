import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let videoUrl = text.trim(); // Solo se espera la URL como entrada

    try {
        // Enviar la URL a la página de Transkriptor para procesamiento
        let res = await fetch(`https://transkriptor.com/es/descargador-de-audio-de-youtube/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `url=${encodeURIComponent(videoUrl)}`,
        });

        if (!res.ok) {
            throw new Error(`Error al contactar la página de Transkriptor. Código de respuesta: ${res.status}`);
        }

        let html = await res.text();
        let $ = cheerio.load(html);

        // Buscar el enlace de descarga del audio
        let audioUrl = $('a.download-link').attr('href');

        if (!audioUrl) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        // Descargar el audio desde el enlace proporcionado
        let audioRes = await fetch(audioUrl);
        if (!audioRes.ok) throw new Error('No se pudo descargar el audio.');
        let audioBuffer = await audioRes.buffer();

        // Enviar el archivo de audio
        await conn.sendMessage(m.chat, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `audio.mp3`
        });
    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, `Error: ${e.message}`, m);
    }
};

// Configuración del comando
handler.help = ['ytmp3'];
handler.command = ['ytmp3', 'ytaudio'];
handler.tags = ['descargas'];

export default handler;