import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
  // Povoleny pouze POST requesty
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validace vstupu
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Inicializace EmailJS s privátním klíčem (jen na backendu!)
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    });

    // Odeslání emailu
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: process.env.CONTACT_EMAIL || 'xjvalis@gmail.com',
        from_name: name || 'Bez jména',
        from_email: email || 'neuvedeno@example.com',
        message: message.trim(),
      }
    );

    return res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
