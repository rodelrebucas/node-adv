const delay = seconds =>
  new Promise(resolves => {
    // Just execute resolves immediately
    setTimeout(() => resolves("Delay done..."), seconds * 1000);
  });

// execute at next tick
const sequential = seconds =>
  Promise.resolve()
    .then(() => console.log("Started"))
    .then(() => {
      console.log("Delay after started");
      return delay(5);
    })
    .then(msg => console.log(msg))
    .then(() => {
      console.log(`Now waiting for ${seconds} second/s`);
      return delay(seconds);
    })
    .then(msg => console.log(msg));

sequential(1);
console.log("Starting sequential");

// Starting sequential
// Started
// Delay after started
// Started already...
// Now waiting for 1 second/s
// Delay done...
