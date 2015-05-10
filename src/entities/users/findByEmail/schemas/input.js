'use strict';

export const INPUT_SCHEMA = {

  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": [
    {
      "email": {
        "type": "string",
        "format": "email"
      }
    }
  ]
};
