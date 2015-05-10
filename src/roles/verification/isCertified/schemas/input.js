'use strict';

export const INPUT_SCHEMA = {

  'id': 'https://api.iscert.com/schemas/verification/isCertified/input',
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'title': 'verification arguments',
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
