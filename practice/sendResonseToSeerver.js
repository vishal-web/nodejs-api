const http = require('http');

const PORT = 5000;

const todos = [
  { id: 1, text: 'My fist work is to complete'},
  { id: 2, text: 'My fist work is to complete'},
]


const server = http.createServer((req, res) => {
  const { url, method } = req;

  let body = [];

  req.on('data', chunk => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    
    let status = 404;
    const response = {
      status: false,
      data: null,
      error: null,
    }
    

    if (method === 'GET' && url === '/todos') {
      status = 200;
      response.status = true;
      response.data = todos
    } else if (method === 'POST' && url === '/todos') {
      const { id, text } = JSON.parse(body);
      if (id && text) {
        todos.push({ id, text });
        status = 201;
        response.status = true;
        response.todos = todos;
      } else {
        response.error = 'Please add id & text';
      }
    }


    res.writeHead(status, {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Nodejs'
    })

    res.end(
      JSON.stringify(response)
    );
  })
});

server.listen(PORT, () => {
  console.log(`Server is now listening on PORT ${PORT}`);
})