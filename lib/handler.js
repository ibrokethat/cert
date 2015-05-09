'use strict';

import co from 'co';
import validator from 'is-my-json-valid';

function toJSON (data) {

  return JSON.parse(JSON.stringify(data));
}

export default function handler (inputSchema = {}, outputSchema = {}, fn) {

  let validateInput = validator(toJSON(inputSchema), {greedy: true});
  let validateOutput = validator(toJSON(outputSchema), {greedy: true});

  return function* (...args) {

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

      return data;
  }

}
