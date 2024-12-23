import axios from 'axios';

const handler = async (m, { args, conn }) => {
  const question = args.join(' ').trim();
  const model = "llama-3.3-70b";

  if (!question) {
    return m.reply('❌ Por favor, proporciona una pregunta para el chatbot.', m);
  }

  if (!m.chat || typeof m.chat !== 'string') {
    console.log('m.chat inválido:', m.chat);
    return m.reply('❌ Error: El destinatario no es válido.', m);
  }

  try {
    const data = JSON.stringify({
      "requestId": "scrape-for-all",
      "modelId": model,
      "prompt": [
        {
          "content": question,
          "role": "user"
        }
      ],
      "systemPrompt": "",
      "conversationType": "text",
      "temperature": 0.8,
      "webEnabled": true,
      "topP": 0.9,
      "isCharacter": false,
      "clientProcessingTime": 2834
    });

    const config = {
      method: 'POST',
      url: 'https://venice.ai/api/inference/chat',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Content-Type': 'application/json',
        'accept-language': 'es-ES',
        'referer': 'https://venice.ai/chat',
        'x-venice-version': '20241221.032412',
        'origin': 'https://venice.ai',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'priority': 'u=4',
        'te': 'trailers'
      },
      data: data
    };

    const res = await axios.request(config);
    const chunks = res.data.split('\n').filter(chunk => chunk).map(chunk => JSON.parse(chunk));
    const answer = chunks.map(chunk => chunk.content).join('');

    await conn.sendMessage(m.chat, {
      text: `🤖 Respuesta: ${answer}`,
      quoted: m,
    });
  } catch (error) {
    console.error(error);
    m.reply('❌ Ocurrió un error al procesar tu solicitud.', m);
  }
};

handler.command = ['chatbot'];
handler.tags = ['ai'];
handler.help = ['chatbot pregunta'];
handler.limit = false;

export default handler;