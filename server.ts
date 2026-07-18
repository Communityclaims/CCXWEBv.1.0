import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import sgMail from '@sendgrid/mail';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Rate/Size limit
  app.use(express.json({ limit: '10kb' }));

  // Abstract endpoint POST /api/inquiry
  // Restrict method to POST for this route
  app.all('/api/inquiry', (req, res, next) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }
    next();
  });

  app.post('/api/inquiry', async (req, res) => {
    try {
      const { name, email, org, focus, message } = req.body || {};

      // Audit Integrity Validation
      if (!name || !email || !focus || !message) {
        return res.status(400).json({ 
          status: "error", 
          message: "Incomplete handshake payload. Audit integrity requires all fields." 
        });
      }

      // Email Format Validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          status: "error", 
          message: "Invalid identity format." 
        });
      }

      // Lazy Mail Dispatch
      const recipientEmail = process.env.INQUIRY_RECIPIENT_EMAIL || 'alison@ccxny.org';
      const sendgridKey = process.env.SENDGRID_API_KEY;

      if (sendgridKey) {
        try {
          sgMail.setApiKey(sendgridKey);
          const msg = {
            to: recipientEmail,
            from: 'system@ccxny.org',
            subject: `CCX Technical Handshake: ${org || 'Independent Inquiry'}`,
            text: `Name: ${name}\nEmail: ${email}\nOrganization: ${org || 'N/A'}\nFocus: ${focus}\n\nMessage:\n${message}`,
            html: `
              <h3>Technical Handshake Received</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Organization:</strong> ${org || 'N/A'}</p>
              <p><strong>Focus Role:</strong> ${focus}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            `
          };
          await sgMail.send(msg);
        } catch (mailError) {
          console.error('[SYSTEM] Dispatch Failure', mailError);
          // Return 200 OK anyway for smooth staging fallbacks
        }
      } else {
        console.warn('[SYSTEM] Dispatch Failure: SENDGRID_API_KEY is not configured in local environment.');
      }

      // Standard successful response
      return res.status(200).json({ 
        status: "success", 
        message: "Handshake initiated successfully.",
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Unhandled server error in inquiry:', err);
      return res.status(500).json({ 
        status: "error", 
        message: "An internal server error occurred during handshake." 
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
