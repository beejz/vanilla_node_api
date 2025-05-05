// server.js
const http = require('http');
const { parse } = require('url');

// In-memory products store
const products = [];

/** Generate a random 10-char alphanumeric ID */
function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/** Parse JSON body into an object */
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = parse(req.url, true);
  const idMatch = pathname.match(/^\/products\/([A-Za-z0-9]{10})$/);

  // ─── CREATE ─── POST /products
  if (req.method === 'POST' && pathname === '/products') {
    try {
      const { name, description, price } = await getRequestBody(req);
      // you could validate here…
      const newProduct = { id: generateId(), name, description, price };
      products.push(newProduct);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(newProduct));
    } catch (err) {
      res.writeHead(400); return res.end('Invalid JSON');
    }
  }

  // ─── READ ALL ─── GET /products
  if (req.method === 'GET' && pathname === '/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(products));
  }

  // ─── READ ONE ─── GET /products/:id
  if (req.method === 'GET' && idMatch) {
    const prod = products.find(p => p.id === idMatch[1]);
    if (!prod) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(prod));
  }

  // ─── UPDATE ─── PUT /products/:id
  if (req.method === 'PUT' && idMatch) {
    const idx = products.findIndex(p => p.id === idMatch[1]);
    if (idx < 0) { res.writeHead(404); return res.end('Not found'); }
    try {
      const { name, description, price } = await getRequestBody(req);
      products[idx] = { id: idMatch[1], name, description, price };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(products[idx]));
    } catch (err) {
      res.writeHead(400); return res.end('Invalid JSON');
    }
  }

  // ─── DELETE ─── DELETE /products/:id
  if (req.method === 'DELETE' && idMatch) {
    const idx = products.findIndex(p => p.id === idMatch[1]);
    if (idx < 0) { res.writeHead(404); return res.end('Not found'); }
    products.splice(idx, 1);
    res.writeHead(204); // No Content
    return res.end();
  }

  // ─── OPTIONAL EXTRA: Palindrome Checker ─── GET /palindrome/:word
  const palMatch = pathname.match(/^\/palindrome\/(.+)$/);
  if (req.method === 'GET' && palMatch) {
    // Decode then trim whitespace/newlines:
    const raw = decodeURIComponent(palMatch[1]);
    const w   = raw.trim();
  
    const isPal = w === w.split('').reverse().join('');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ word: w, palindrome: isPal }));
  }

  // ─── 404 ───
  res.writeHead(404);
  res.end('Route not found');
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
