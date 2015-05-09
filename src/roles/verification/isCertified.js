'use strict';

import co from 'co';
import config from 'config';

import {call, register} from '../../../lib/app';
// import emailSchema from '../../schemas/common/email';


let db = {
  user: {
    find: function (email) {
      return Promise.resolve({
        email: email
      });
    }
  }
}

export default function* isCertified (email) {

  let user = yield db.user.find({email: email});

  return {
    email: email,
    isCertified: !!user
  };
}


export const META = {
  role: config.roles.VERIFICATION,
  cmd: config.cmds.IS_CERTIFIED
}


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
}


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
}


register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, isCertified);


// setInterval(() => {

//   co(function* () {

//     let r = yield call({role: config.roles.VERIFICATION, cmd: config.cmds.IS_CERTIFIED}, 'sarah@hackneygrove.com');
//     console.log(r);

//   });
// }, 200);
