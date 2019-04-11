// Callback pattern
console.log("Start Ticking");

// Synchronous
// continuation passing style
const hideString = (str, done) => done(str.replace(/[a-zA-Z]/g, "Y"));

// pass the done callback
hideString("Replace me now", str => {
  console.log("Replaced immediately: ", str);
});

// Asynchronous I
const asyncHideString = (str, done) => {
  // Invoke on next loop on event loop
  process.nextTick(() => {
    done(str.replace(/[a-zA-Z]/g, "Z"));
  });
};

asyncHideString("Replace me later", str =>
  console.log("Replaced at next tick: ", str)
);

// Asynchronous II with setTimeout
const delay = (seconds, callback) => {
  // Minimum wait time before pushing to queue for stack execution
  setTimeout(callback, seconds * 1000);
};

delay(3, () => console.log("Wait at minimum 3 seconds"));

// Nested or sequential
delay(1, () => {
  console.log("Wait at minimum 1 second");
  delay(1, () => {
    console.log("Wait at minimum 2 seconds");
  });
});

// ---
console.log("Done Ticking");
