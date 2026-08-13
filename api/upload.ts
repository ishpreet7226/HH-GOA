import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, name } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    
    const safeName = (name || 'builder').replace(/\s+/g, '-').toLowerCase();
    const filename = `hh-goa-${safeName}-${Date.now()}.png`;

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    return res.status(200).json({ url: blob.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}
