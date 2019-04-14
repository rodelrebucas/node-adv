const delay = seconds =>
  new Promise(resolves => {
    // Just execute resolves
    setTimeout(resolves("Delay done..."), seconds * 1000);
  });

// execute at next tick
const sequential = seconds =>
  Promise.resolve()
    .then(() => console.log("Started"))
    .then(() => {
      console.log("Delay after started");
      return delay(seconds);
    })
    .then(() => console.log("Started already..."))
    .then(() => {
      console.log(`Now waiting for ${seconds} second/s`);
      return delay(seconds);
    })
    .then(msg => console.log(msg));

sequential(1);
console.log("Starting sequential");
