const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html"); // set a response type
  const url = req.url;
  if (url === "/") {
    // create a response
    res.write(
      "<html><body><h1>Hello Node!</h1><form action='/message' method='POST'><input type='text' name='message'/><button type='submit'>send</button></form></body></html>"
    );
    return res.end();
  }

  if (url === "/message" && req.method === "POST") {
    // parse the post request
    // process data until complete (node's job)
    // listen to data events
    const body = [];
    req.on("data", chunk => {
      console.log("chunk:", chunk); // buffer, temporary memory location
      body.push(chunk);
    });
    // gather the data
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      fs.writeFileSync("message.txt", parsedBody.split("=")[1]);
    });

    res.statusCode = 302; // redirect
    res.setHeader("Location", "/");
    return res.end();
  }
});

server.listen(5000);
