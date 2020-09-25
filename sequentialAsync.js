// Sequential execution using async/await

const delay = seconds =>
  new Promise(resolves => {
    setTimeout(resolves, seconds * 1000);
  });

const sequential = async seconds => {
  try {
    await delay(2);
    console.log("Awaited 2");
    await (seconds + 1);
    console.log(`Awaited ${seconds + 1}`);
    await (seconds + 2);
    console.log(`Awaited ${seconds + 2}`);
  } catch (err) {
    console.log(err);
  }
};
sequential(5);
