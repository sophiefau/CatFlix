const http = require('http'),
  fs = require('fs'),
  url = require('url');

  http.createServer((request, response) => {
    let addr = request.url,
      q = new URL(addr, 'http://' + request.headers.host),
      filePath = ''; // set to an empty string to act as an empty container > variable is placed in the if-else statement

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    }); 

    if (q.pathname.includes('documentation')) { // q is where the parsed URL is stored. The pathname is the part that comes immediately after the first "/" 
      filePath = (__dirname + '/documentation.html'); // __dirname is a module-specific variable that provides the path to the current directory.
    } else {
      filePath = 'index.html'; // This ensures that, if the user makes a request to a URL that doesn't exist on your server, they'll simply be returned to your main page.
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
  
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    });
  
  }).listen(8080); // server port

console.log('To access to my first Node server, go to "http://localhost:8080/".');
