  
Simple testing library with no excessive syntax.

### Install

   yarn add testfu --dev

    
### Usage

    // node
    // const chalk = require('chalk');
    // const { testf } = require('./testf');
    // const { nodeOptions } = require('./testf');
    // const { log, is, array_is } = testf(nodeOptions(chalk));


    // browser
    import { log, is, array_is } from 'testiz;
    
    
    function tests() {
      log('passing tests');
      ok('true is ok', true);
      is('three is three', 3, 3);

      log('failing tests');
      is('three is two', 3, 2);
      ok('null is ok', null);
      array_is('not equal', [1,2], [2,3,4]);

    }

    tests();
    # testf
