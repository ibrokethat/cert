'use strict';

export const OUTPUT_SCHEMA = {

  'id': 'https://api.wistla.com/schemas/0.1.0/warning',
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'title': 'registration response',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'registration': {
      'type': 'boolean'
    }
  }
};
