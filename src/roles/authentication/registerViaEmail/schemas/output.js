'use strict';

export const OUTPUT_SCHEMA = {

  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "registration": {
      "type": "boolean"
    }
  }
};
