export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, phone, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and Phone are required' });
    }

    // Configuration
    const BOT_TOKEN = '8492152792:AAGzj0F6NQPN0du9AiC2YsIaqtBsvvMy5n4';
    const CHAT_ID = '379728160';

    // Formatting the message
    const text = `
📩 **Новая заявка с сайта!**

👤 **Имя:** ${name}
📞 **Телефон:** ${phone}
📝 **Сообщение:**
${message || 'Без сообщения'}
    `;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            }),
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Telegram Error:', data);
            return res.status(500).json({ error: 'Telegram API Error', details: data });
        }
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
