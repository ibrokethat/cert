'use strict';

import co from 'co';
import validator from 'is-my-json-valid';


function toJSON (data) {

  return JSON.parse(JSON.stringify(data));
}

export default function handler (meta, inputSchema = {}, outputSchema = {}, fn) {

  let validateInput = validator(inputSchema, {greedy: true});
  let validateOutput = validator(outputSchema, {greedy: true});

  return function* (...args) {

      process.emit('app:debug', meta, 'start', 'args: ', ...args);
      process.emit('app:time', meta);

      let data;

      if (validateInput(args)) {

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
