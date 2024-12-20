import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let videoUrl = text.trim(); // Solo se espera la URL como entrada

    try {
        // Construimos la URL para la API de Zeemo sin API key
        let apiUrl = `https://zeemo.ai/es/downloadVideo?fromPage=3&videoInfoKey=1734717425992&index=6&langCode=es&url=${encodeURIComponent(videoUrl)}`;
        
        // Hacer la solicitud a la API de Zeemo
        let res = await fetch(apiUrl);

        if (!res.ok) {
            throw new Error(`Error al contactar la API de Zeemo. Código de respuesta: ${res.status}`);
        }

        // Intentamos obtener la respuesta como JSON
        let result = await res.json();

        // Verificamos si la API devolvió un enlace de descarga del audio
        if (!result?.downloadUrl) {
            throw new Error('No se encontró un enlace válido para descargar el audio.');
        }

        let audioUrl = result.downloadUrl;

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