import http from 'http';

// In-memory storage
const products = [];

// Generates a 10-character alphanumeric ID
function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Utility to parse JSON body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Check if a word is a palindrome
function isPalindrome(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// Generate a random product name
function randomProductName() {
  const adjectives = ['Super', 'Mega', 'Ultra', 'Hyper', 'Fantastic'];
  const items = ['Widget', 'Gadget', 'Device', 'Tool', 'Item'];
  const a = adjectives[Math.floor(Math.random() * adjectives.length)];
  const i = items[Math.floor(Math.random() * items.length)];
  return `${a} ${i}`;
}

// Main request handler
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // GET /products
  if (req.method === 'GET' && path === '/products') {
    return res.end(JSON.stringify(products));
  }

  // GET /products/:id
  if (req.method === 'GET' && path.startsWith('/products/')) {
    const id = path.split('/')[2];
    const prod = products.find(p => p.id === id);
    if (!prod) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'Not found' }));
    }
    return res.end(JSON.stringify(prod));
  }

  // POST /products
  if (req.method === 'POST' && path === '/products') {
    try {
      const body = await parseRequestBody(req);
      const id = generateId();
      // Example override: enforce full name and metadata
      const now = new Date();
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const product = {
        id,
        name: 'Bee Jay Gomez',                     // your full name
        description: '2025 BSCS Second Year Inspired', // your ID, course, year, status
        price: parseInt(hh + mm),                 // record time hhmm
      };
      products.push(product);
      res.statusCode = 201;
      return res.end(JSON.stringify(product));
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  // PUT /products/:id
  if (req.method === 'PUT' && path.startsWith('/products/')) {
    try {
      const id = path.split('/')[2];
      const body = await parseRequestBody(req);
      const prodIndex = products.findIndex(p => p.id === id);
      if (prodIndex < 0) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Not found' }));
      }
      // Example override: enforce favorite movie metadata
      const updated = {
        ...products[prodIndex],
        name: body.name || 'Your Favorite Movie',
        description: body.description || 'Reason why you like it',
        price: body.price || 120, // duration in minutes
      };
      products[prodIndex] = updated;
      return res.end(JSON.stringify(updated));
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  // DELETE /products/:id
  if (req.method === 'DELETE' && path.startsWith('/products/')) {
    const id = path.split('/')[2];
    const idx = products.findIndex(p => p.id === id);
    if (idx < 0) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'Not found' }));
    }
    products.splice(idx, 1);
    return res.end(JSON.stringify({ success: true }));
  }

  // GET /palindrome/:word
  if (req.method === 'GET' && path.startsWith('/palindrome/')) {
    const word = path.split('/')[2];
    return res.end(JSON.stringify({ word, palindrome: isPalindrome(word) }));
  }

  // GET /random-name
  if (req.method === 'GET' && path === '/random-name') {
    return res.end(JSON.stringify({ name: randomProductName() }));
  }

  // Fallback for unsupported routes
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Route not found' }));
}

// Start server with nodemon or node --watch
const PORT = process.env.PORT || 5001;
http.createServer(handleRequest).listen(PORT, () => console.log(`Server listening on port ${PORT}`));
