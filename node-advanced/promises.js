// Promises replaces callback
const delay = seconds =>
  new Promise((resolves, rejects) => {
    setTimeout(() => {
      // return value
      resolves(`Resolved after: ${seconds}`);
    }, seconds * 1000);
  });

delay(2).then(returned => console.log(returned, ", Delayed for 2 seconds"));

// First Tick
// Returned after: 2 , Delayed for 2 seconds

console.log("First Tick");
