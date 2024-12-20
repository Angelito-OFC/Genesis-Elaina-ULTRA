import fetch from 'node-fetch';
import FormData from 'form-data';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text || !text.trim()) {
        return conn.reply(m.chat, `Por favor, utiliza el formato: ${usedPrefix}${command} <url>`, m);
    }

    let videoUrl = text.trim();

    try {
        // Construir el formulario de datos para enviar a Transkriptor
        let formData = new FormData();
        formData.append('url', videoUrl);
        formData.append('format', 'mp3');

        // Hacer la solicitud a la página de Transkriptor
        let res = await fetch('https://transkriptor.com/es/descargador-de-audio-de-youtube/', {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders()
            }
        });

        if (!res.ok) {
            throw new Error(`Error al intentar descargar el audio. Código de respuesta: ${res.status}`);
        }

        // Obtener la respuesta HTML
        let htmlContent = await res.text();

        // Intentar encontrar la URL de descarga en la respuesta HTML
        let downloadLinkMatch = htmlContent.match(/href="([^"]+\.mp3)"/);
        if (downloadLinkMatch && downloadLinkMatch[1]) {
            let downloadLink = downloadLinkMatch[1];

            // Descargar el archivo MP3
            let audioRes = await fetch(downloadLink);
            if (!audioRes.ok) throw new Error('No se pudo descargar el audio.');

            let audioBuffer = await audioRes.buffer();

            // Enviar el archivo de audio
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: 'audio.mp3'
            });
        } else {
            throw new Error('No se pudo encontrar un enlace de descarga en la respuesta.');
        }
    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `Error: ${error.message}`, m);
    }
};

// Configuración del comando
handler.help = ['ytmp3'];
handler.command = ['ytmp3', 'ytaudio'];
handler.tags = ['descargas'];

export default handler;