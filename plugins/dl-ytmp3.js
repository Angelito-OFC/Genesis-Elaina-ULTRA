import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let url = text.trim(); // Solo se espera la URL como entrada

    try {
        // Obtener información del video
        let res = await fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${url}`);
        if (!res.ok) throw new Error('No se pudo obtener la información del video.');
        let info = await res.json();

        let title = info.title || 'Sin título';
        let duration = info.duration || 'Desconocida';
        let audioDownloadLink = info.audio?.[0]?.url; // Ruta para descargar el audio

        if (!audioDownloadLink) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        // Descargar el audio
        let audioRes = await fetch(audioDownloadLink);
        if (!audioRes.ok) throw new Error('No se pudo descargar el audio.');

        let audioBuffer = await audioRes.buffer();
        let audioSize = audioBuffer.length / (1024 * 1024); // Tamaño en MB

        // Crear mensaje informativo
        let message = `
[YTMP3 DESCARGADOR]
🎵 *Título:* ${title}
🔗 *Enlace:* [Ver aquí](${url})
⏱️ *Duración:* ${duration} minutos
📦 *Tamaño del archivo:* ${audioSize.toFixed(2)} MB
🎧 *Formato:* MP3
`;

        await conn.reply(m.chat, message, m);

        // Enviar el archivo de audio
        await conn.sendMessage(m.chat, {
            document: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
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