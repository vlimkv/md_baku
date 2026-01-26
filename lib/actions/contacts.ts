"use server";

export async function sendToTelegram(formData: FormData) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return { success: false, message: "Token not found" };

  const name = formData.get("name");
  const phone = formData.get("phone");
  const message = formData.get("message");

  const text = `
🔥 *Новая заявка с сайта MD Baku*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
💬 *Сообщение:* ${message}
  `;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (res.ok) return { success: true };
    return { success: false };
  } catch (e) {
    return { success: false };
  }
}