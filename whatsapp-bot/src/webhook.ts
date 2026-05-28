import express from 'express';
import twilio from 'twilio';
import { handleMessage } from './commands';

export function setupWebhook(app: express.Application): void {
  app.post('/webhook', express.urlencoded({ extended: false }), async (req, res) => {
    try {
      const from: string = req.body.From || '';
      const body: string = (req.body.Body?.trim() as string) || '';

      if (!from) {
        res.status(400).send('Missing From field');
        return;
      }

      const reply = await handleMessage(from, body);

      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message(reply);

      res.type('text/xml');
      res.send(twiml.toString());
    } catch (err) {
      console.error('Webhook error:', err);
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message('Sorry, something went wrong. Please try again!');
      res.type('text/xml');
      res.send(twiml.toString());
    }
  });
}
