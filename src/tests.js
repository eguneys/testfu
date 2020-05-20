const chalk = require('chalk');

const { testf } = require('./testf');
const { nodeOptions } = require('./testf');

const { log, is, array_is } = testf(nodeOptions(chalk));


function tests() {
  log('passing tests');
  array_is('equal array', [1,2,3], [1,2,3]);
  // ok('true is ok', true);
  is('three is three', 3, 3);
  // not('three is not four', 3, 4);

  log('failing tests');
  array_is('missing array', [1,2,6], [1,2,3, 4]);
  is('three is two', 3, 2);
  // ok('null is ok', null);

  log('throwing tests');

  // throws('should throw bad exception should pass', 'bad exception', () => {
  //   throw new Error("bad exception lkaf");
  // });

  // throws('should not throw bad exception should fail', 'bad exception', () => {
  //   throw new Error("lkaf");
  // });

  // throws('should not throw should fail', 'bad exception', () => {});

}

tests();
