import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.warn(
    'TELEGRAM_BOT_TOKEN is not configured. Telegram bot will not start.'
  );
} else {
  const apiUrl = `https://api.telegram.org/bot${token}`;

  let offset = 0;

  async function sendMessage(chatId: number, text: string) {
    const response = await fetch(`${apiUrl}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Telegram sendMessage failed: ${errorText}`);
    }
  }

  async function pollTelegram() {
    console.log('Nordic Ember Telegram bot started.');

    while (true) {
      try {
        const response = await fetch(
          `${apiUrl}/getUpdates?timeout=30&offset=${offset}`
        );

        if (!response.ok) {
          throw new Error(
            `Telegram getUpdates failed: ${response.status}`
          );
        }

        const data = await response.json() as any;

        for (const update of data.result ?? []) {
          offset = update.update_id + 1;

          const message = update.message;

          if (!message) {
            continue;
          }

          const chatId = message.chat.id;
          const text = message.text;

          if (text === '/start') {
            const firstName = message.from?.first_name;

            const greeting = firstName
              ? `Welcome ${firstName} to Nordic Ember! 🔥`
              : 'Welcome to Nordic Ember! 🔥';

            await sendMessage(
              chatId,
              `${greeting}

Experience modern Nordic dining in Stockholm.

Explore our seasonal menu, discover our dishes, and reserve your table through Nordic Ember.

Our Telegram Mini App will be available here soon.`
            );
          }
          if (text === '/help') {
                 await sendMessage(
               chatId,
            `🔥 Nordic Ember

          Available commands:

             /start - Welcome to Nordic Ember
          /help - Show available commands

         Our restaurant Mini App will soon let you explore the seasonal menu and reserve a table directly from Telegram.`
  );
}

        }
      } catch (error) {
        console.error('Telegram polling error:', error);

        // Wait briefly before trying again.
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  pollTelegram().catch((error) => {
    console.error('Telegram bot stopped:', error);
  });
}