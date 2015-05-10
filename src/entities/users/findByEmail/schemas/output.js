'use strict';

import {USER_SCHEMA} from "../../schemas/user";


let userSchema = clone(USER_SCHEMA);


export const OUTPUT_SCHEMA = excludeFrom(userSchema, {
  "properties": {
    "password": {
      "type": "string"
    },
    "cc-no": {
      "type": "number"
    }
  }
});




//  user schema

{

  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email"
    },
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "title": {
      "type": "string",
      "enum": ["Mr", "Mrs", "Miss", "Dr", "Etc"] // pull in lanaguage specific enums
    },
    "isCertified": {
      "type": "boolean"
    },
    "password": {
      "type": "string"
    },
    "sex": {
      "type": "string",
      "enum": ["m", "f"]
    },
    "cc-no": {
      "type": "number"
    }
  }
};

