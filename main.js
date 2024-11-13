const childProcess = require('child_process')

const channel = childProcess.fork('./child.js', [], { serialization: 'advanced' })

let c = 0;
channel.on('message', (msg) => {
  c++;
})

const kChannelHandle = Object.getOwnPropertySymbols(channel).find(s => s.description === 'kChannelHandle');
const kMessageBuffer = Object.getOwnPropertySymbols(channel[kChannelHandle]).find(s => s.description === 'kMessageBuffer');
const kMessageBufferSize = Object.getOwnPropertySymbols(channel[kChannelHandle]).find(s => s.description === 'kMessageBufferSize');
setInterval(() => {
  const d = new Date().toLocaleString();
  console.log('-'.repeat(20));
  console.log(`${d} main message count=${c}`);
  console.log(`${d} main kMessageBuffer.length=${channel[kChannelHandle][kMessageBuffer].length}`);
  console.log(`${d} main kMessageBufferSize=${channel[kChannelHandle][kMessageBufferSize]}`);
  if (channel[kChannelHandle][kMessageBuffer].length) {
    console.log(`${d} main kMessageBuffer[0].length=${channel[kChannelHandle][kMessageBuffer][0].length}`);
  }
}, 1000)