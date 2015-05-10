'use strict';

export const INPUT_SCHEMA = {

  'id': 'https://api.wistla.com/schemas/0.1.0/warning',
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'title': 'registration arguments',
  'type': 'array',
  'items': [
    {
      'email': {
        'type': 'string',
        'format': 'email'
      }
    }
  ]
};
