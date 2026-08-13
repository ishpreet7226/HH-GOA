import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { img, name, role } = req.query;
  
  if (!img) {
    return res.status(400).send('Missing image parameter');
  }

  const decodedImg = decodeURIComponent(img as string);
  const decodedName = decodeURIComponent((name as string) || 'Builder');
  const decodedRole = decodeURIComponent((role as string) || 'Builder');
  
  const title = `${decodedName} - HH Goa 2026 Builder ID`;
  const description = `Role: ${decodedRole}. Building the future in Goa this October. #FrameInGoa`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${decodedImg}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${decodedImg}">

      <style>
        body {
          margin: 0;
          background: #0b2e1b;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-family: monospace;
          color: #eebb22;
        }
        a {
          color: #e5245e;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.2rem;
        }
        a:hover {
          text-decoration: underline;
        }
        .container {
          text-align: center;
        }
        img {
          max-width: 90%;
          max-height: 70vh;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${decodedImg}" alt="HH Goa 2026 Builder ID">
        <br>
        <a href="/">Create your own Builder ID</a>
      </div>
      <script>
        // Redirect to home page after a short delay if needed, 
        // but showing the image is better for users clicking the link.
      </script>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
