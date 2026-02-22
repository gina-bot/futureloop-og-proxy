import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send('<html><body><p>OK - id: ' + (id || 'none') + '</p></body></html>');
}
