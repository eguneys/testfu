function testf({
  onLog,
  onPass,
  onFails
}) {
  const fails = messages => ({
    fails: messages
  });

  const passed = aFail => aFail.fails.length === 0;

  const notEqualMessage = (notEqual, a, b) => `${a} ${notEqual} ${b}`;

  const array_is_matcher = (actual, expected) => {
    let messages = [];

    for (let aI in actual) {
      if (actual[aI] !== expected[aI]) {
        messages.push(`Extra ` + JSON.stringify(actual[aI]));
      }
    }

    for (let bI in expected) {
      if (actual[bI] !== expected[bI]) {
        messages.push(`Missing ` + JSON.stringify(expected[bI]));
      }
    }

    if (messages.length > 0) {
      messages.unshift(notEqualMessage('!==', JSON.stringify(actual), JSON.stringify(expected)));
    }

    return fails(messages);
  };

  const is_matcher = (actual, expected) => {
    let messages = [];

    if (actual !== expected) {
      messages.push(notEqualMessage('!==', JSON.stringify(actual), JSON.stringify(expected)));
    }

    return fails(messages);
  };

  const makeTester = matcherF => {
    return (msg, ...args) => {
      let result = matcherF(...args);

      if (passed(result)) {
        onPass(msg);
      } else {
        onFails(msg, result);
      }
    };
  };

  const makeLogger = () => {
    return msg => {
      onLog(msg);
    };
  };

  const log = makeLogger();
  const is = makeTester(is_matcher);
  const array_is = makeTester(array_is_matcher);
  return {
    log,
    is,
    array_is,
    makeTester
  };
}

const browserOptions = {
  onLog: msg => {
    console.log('%c ## ', 'background: yellow; ', msg);
  },
  onPass: msg => {
    console.log('%cpass ', 'background: green;', msg);
  },
  onFails: (msg, {
    fails
  }) => {
    console.log('%cfail ', 'background: red; ', msg);
    fails.forEach(_ => console.log(_));
  }
};

const nodeOptions = chalk => ({
  onLog: msg => {
    console.log(chalk.yellow(' ## ') + ' ' + msg);
  },
  onPass: msg => {
    console.log(chalk.green('pass ') + ' ' + msg);
  },
  onFails: (msg, {
    fails
  }) => {
    console.log(chalk.red('fail ') + ' ' + msg);
    fails.forEach(_ => console.log(_));
  }
});

module.exports = testf(browserOptions);
module.exports.nodeOptions = nodeOptions;
module.exports.testf = testf;