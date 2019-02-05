const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  res.setHeader("Content-Type", "text/html"); // set a response type
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

    // async functions
    // callback or emitted once a condition is met
    req.on("data", chunk => {
      console.log("chunk:", chunk); // buffer, temporary memory location
      body.push(chunk);
    });
    // gather the data
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      //   fs.writeFileSync("message.txt", ); // blocking code
      // non blocking
      fs.writeFile("message.txt", parsedBody.split("=")[1], err => {
        // simulate a long process
        setTimeout(() => {
          res.statusCode = 302; // redirect after done
          console.log("execute redirect");
          res.setHeader("Location", "/");
          return res.end();
        }, 5000);
      });
    });
  }
};

// export default requestHandler;

// register to global module
module.exports = requestHandler;
