'use strict';

export const INPUT_SCHEMA = {

  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "minItems": 2,
  "items": [
    {
      "title": "messageType",
      "type": "string"
    },
    {
      "title": "entity",
      "type": "object"
    }
  ]
};
