'use strict';

export const OUTPUT_SCHEMA = {

  'id': 'https://api.iscert.com/schemas/verification/isCertified/output',
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'title': 'verification response',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'format': 'email'
    },
    'isCertified': {
      'type': 'boolean'
    }
  }
};
