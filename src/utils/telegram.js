const BOT_TOKEN = '8891492641:AAH6dNVJebwcw3tTFECSc1N4eLsVZrkfl1w';
const CHAT_ID = '7145041308';

export const sendTelegramMessage = async (text) => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to send telegram message:', await response.text());
    }
    return response.ok;
  } catch (error) {
    console.error('Telegram API error:', error);
    return false;
  }
};
