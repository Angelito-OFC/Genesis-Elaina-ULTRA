import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let url = text.trim(); // Solo se espera la URL como entrada

    try {
        // Consultar la API para descargar el audio en MP3
        let res = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${args[0]}`);
        if (!res.ok) throw new Error('No se pudo obtener la información del video.');
        let result = await res.json();

        if (!result.status || !result.result || !result.result.url) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        let audioUrl = result.result.url;

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
        return conn.reply(m.chat, 'No se pudo completar la descarga. Intenta nuevamente más tarde.', m);
    }
};

// Configuración del comando
handler.help = ['ytmp3'];
handler.command = ['ytmp3', 'ytaudio'];
handler.tags = ['descargas'];

export default handler;