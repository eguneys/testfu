const chalk = require('chalk');

function Testutils(opts) {
  const { passMessage,
          failMessage,
          logMessage } = opts;

  const ok = runtest(matcher((a) => a !== null && a !== undefined, '[is null or undefined]'));

  const not = runtest(matcher((a, b) => a !== b, '==='));

  const is = runtest(matcher((a, b) => a === b, '!=='));

  const isabove = runtest(matcher((a, b) => a >= b, '>=!'));

  const deep_is = runtest(matcher((a, b) => {
    if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') return objectCompare(a, b);
    else return a === b;
  }, '!=='));

  const throws = runtestPlus(matcher((emsg, f) => {
    var caught;
    try {
      f();
    } catch(err) {
      caught = err;
    }
    if (!caught) return { err: 'didnt throw' };
    if (!caught.message.match(emsg)) return { err: 'throwed ' + caught.message };
    return {};
  }, ''));

  function matcher(f, s) {
    return { matcher: f, onfail: s };
  }

  function runtest({ matcher, onfail }) {
    return function(msg, a, b) {
      var passfail = '';
      var res = '';
      if (matcher(a, b)) {
        passfail = passMessage;
      } else {
        passfail = failMessage;
        res += JSON.stringify(a) + ` ${onfail} ` + JSON.stringify(b);
      }
      res = msg + ' ' + res;
      withLogger(passfail)(res);
    };
  }

  function runtestPlus({ matcher, onfail }) {
    return function(msg, ...args) {
      var passfail = '';
      var res = '';
      var { err } = matcher(...args);
      if (!err) {
        passfail = passMessage;
      } else {
        passfail = failMessage;
        res += onfail + ' ' + err;
      }
      res = msg + ' ' + res;
      withLogger(passfail)(res);
    };
  }

  const log = withLogger(logMessage);

  function withLogger(logger) {
    return function(msg) {
      const message = logger(msg);
      if (message[2]) {
        console.log(message[0], message[1], message[2]);
      } else if (message[1]) {
        console.log(message[0], message[1]);
      } else {
        console.log(message[0]);
      }
    };
  }

  return {
    ok,
    not,
    is,
    isabove,
    deep_is,
    throws,
    matcher,
    runtest,
    log
  };
};

const browserOptions = {
  logMessage: (msg) => ['%c ## ', 'background: yellow; ', msg],
  failMessage: (msg) => ['%cfail ', 'background: red; ', msg],
  passMessage: (msg) => ['%cpass ', 'background: green;', msg]
};

const nodeOptions = {
  logMessage: (msg) => [chalk.yellow(' ## ') + ' ' + msg, ''],
  failMessage: (msg) => [chalk.red('fail ') + ' ' + msg, ''],
  passMessage: (msg) => [chalk.green('pass ') + ' ' + msg, '']
};

module.exports = Testutils(nodeOptions);
module.exports.testBrowser = Testutils(browserOptions);
module.exports.browserOptions = browserOptions;
module.exports.Testutils = Testutils;
