'use strict';

export const USER_SCHEMA = {

  "$schema": "http://json-schema.org/draft-04/schema#",
  "oneOf": [
    {
      "type": "boolean",
      "enum": [false]
    },
    {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "format": "email",
          "auth": "red"
        },
        "firstName": {
          "type": "string",
          "auth": "green"
        },
        "lastName": {
          "type": "string",
          "auth": "green"
        },
        "title": {
          "type": "string",
          "enum": ["Mr", "Mrs", "Miss", "Dr"],
          "auth": "green"
        },
        "isCertified": {
          "type": "boolean",
          "auth": "red"
        },
        "password": {
          "type": "string"
        },
        "sex": {
          "type": "string",
          "enum": ["m", "f"],
          "auth": "green"

        },
        "cc-no": {
          "type": "number"
        }
      }
    }
  ]
};

