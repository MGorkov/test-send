module.exports = (function (f) {
    let queue = []
      , state = true
      , count = 0;
    let store = (args) => {
      queue.push(args);
    };
    setInterval(() => {
      const d = new Date().toLocaleString();
      console.log(`${d} child send count=${count} state=${state} queueLen=${queue.length}`);
    }, 1000);

    process.send = function () {
      count++;
      let idx;
      if (typeof arguments[1] == 'function') {
        idx = 1;
      }
      else if (arguments[1] !== undefined) {
        if (typeof arguments[2] == 'function') {
          idx = 2;
        }
        else if (arguments[2] !== undefined) {
          if (typeof arguments[3] == 'function') {
            idx = 3;
          }
        }
      }
      //
      let args = [...arguments];
      try {
        let fn;
        let fcb = (err) => {
          state = err === null;
          if (!state) console.log('Error sending to master. Queue length:', queue.length, 'Error:', err);
          fn && fn.call(this, err);
          while (state && queue.length) {
            state = f.apply(this, queue.shift());
          }
        };
        if (idx) {
          fn = arguments[idx];
          args[idx] = fcb;
        }
        else {
          args.push(fcb);
        }
        if (queue.length || !state) {
          store(args);
        }
        else {
          state = f.apply(this, args);
        }
      }
      catch (err) {
        console.log(`Send error: ${err}`);
        store(args);
        state = true;
      }
      return state;
    };
  })(process.send);