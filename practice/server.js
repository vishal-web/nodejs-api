const http = require('http');

const todos = [
  { id: 1, text: 'My fist work is to complete'},
  { id: 2, text: 'My fist work is to complete'},
]

const server = http.createServer((req, res) => {

  // res.statusCode = 400;
  // res.setHeader('Content-Type', 'application/json');
  // res.setHeader('X-Powered-By', 'Node.js');

  // You can also do this as
  res.writeHead(400,{
    'Content-Type': 'application/json',
    'X-Powered-By': 'Nodejs'
  });

  res.end({
    success: true,
    data: todos
  });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
