'use strict';

import {map} from '@ibrokethat/iter';
import validator from 'is-my-json-valid';
import freeze from './freeze';


export default function handler (meta, inputSchema = {}, outputSchema = {}, fn) {

  let validateInput = validator(inputSchema, {greedy: true});
  let validateOutput = validator(outputSchema, {greedy: true});

  return function* (...args) {

      process.emit('app:debug', meta, 'start', 'args: ', ...args);
      process.emit('app:time', meta);

      let data;

      let [, ...input] = args;

      if (validateInput(input)) {

        args = freeze(args);

        data = yield fn(...args)

        if (!validateOutput(data)) {

          data = validateOutput.errors;
        }

      }
      else {

        data = validateInput.errors;
      }

      process.emit('app:debug', meta, 'end', 'return: ', data);
      process.emit('app:timeend', meta);

      return data;
  }

}
