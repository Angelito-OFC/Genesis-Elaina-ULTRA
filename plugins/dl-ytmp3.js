import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let videoUrl = text.trim(); // Solo se espera la URL como entrada

    try {
        // Usar la API de YtMp3 para obtener el enlace de descarga MP3
        let res = await fetch(`https://ytmp3.cc/api/widget/convert?url=${encodeURIComponent(videoUrl)}`);
        
        if (!res.ok) {
            throw new Error(`Error al contactar la API de YtMp3. Código de respuesta: ${res.status}`);
        }

        let result = await res.json();

        // Verificar si la respuesta contiene la URL de descarga del audio
        if (!result?.link) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        let audioUrl = result.link;

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