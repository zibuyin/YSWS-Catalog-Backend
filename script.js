const http = require('http');

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  // TODO CORS to only allow ysws
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  console.log(pathname)
  // TODO: Remove root after merge
  if (pathname === "/" || pathname === "/api/v1/ysws_stats") {
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
  }

  else if (pathname === "/api/v1/ip"){
      try {
        const ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
        console.log(ip)
        const apiRes = await fetch(`https://ip.hackclub.com/ip/${ip}`);
        const apiData = await apiRes.json();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');


        res.end(JSON.stringify(apiData));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to fetch IP' }));
      }
  }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }

});
  

server.listen(8080, '0.0.0.0', () => {
  console.log('Server running at http://localhost:8080/');
});