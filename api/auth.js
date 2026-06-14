export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  // Ověření hesla
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (password === ADMIN_PASSWORD) {
    // Generování jednoduchého tokenu (můžete použít JWT)
    const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
    
    return res.status(200).json({ 
      success: true,
      token: token
    });
  }

  return res.status(401).json({ error: 'Invalid password' });
}
