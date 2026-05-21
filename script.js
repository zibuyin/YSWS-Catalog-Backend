const http = require('http');

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const apiRes = await fetch('https://ships.hackclub.com/api/v1/stats');
    const apiData = await apiRes.json();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');


    res.end(JSON.stringify(apiData));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to fetch ship stats' }));
  }
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080/');
});