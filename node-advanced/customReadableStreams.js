const { Readable } = require("stream");

const cards = ["Heart", "Spade", "Flower", "Diamond"];

class StreamFromArray extends Readable {
  constructor(array = []) {
    // 1. Read with Binary mode as binary or string pass an encoding
    // super({ encoding: "utf-8" });
    // 2. Read with objectMode reads object
    // or Object mode
    super({ objectMode: true });
    this.array = array;
    this.index = 0;
  }

  // Override
  _read() {
    if (this.index <= this.array.length) {
      //   const chunk = this.array[this.index];
      const chunk = {
        data: this.array[this.index],
        index: this.index
      };
      this.push(chunk);
      this.index += 1;
    } else {
      this.push(null); // signals no readable left
    }
  }
}

const cardStream = new StreamFromArray(cards);

// listen to data event
cardStream.on("data", chunk => console.log(chunk));

// listen to end event
cardStream.on("end", () => console.log("Done reading."));
