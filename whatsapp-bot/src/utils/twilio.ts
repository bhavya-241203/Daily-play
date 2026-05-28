import twilio from 'twilio';

let client: ReturnType<typeof twilio> | null = null;

function getClient(): ReturnType<typeof twilio> {
  if (!client) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return client;
}

export async function sendMessage(to: string, body: string): Promise<void> {
  const c = getClient();
  await c.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM!,
    to,
    body,
  });
}
