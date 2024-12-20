import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let videoUrl = text.trim(); // Solo se espera la URL como entrada

    try {
        // Consultar la API de SaveFrom para obtener la URL del audio
        let res = await fetch(`https://savefrom.net/api/api.php?url=${encodeURIComponent(videoUrl)}`);
        
        if (!res.ok) {
            throw new Error(`Error al contactar la API de SaveFrom. Código de respuesta: ${res.status}`);
        }

        // Intentamos obtener el resultado JSON
        let result;
        try {
            result = await res.json();
        } catch (e) {
            // Si la respuesta no es JSON, es probable que sea una página HTML
            throw new Error('La respuesta no es un JSON válido. Puede ser una página de error o de redirección.');
        }

        // Verificar si se obtuvo un enlace de descarga del audio
        if (!result?.url) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        let audioUrl = result.url;

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