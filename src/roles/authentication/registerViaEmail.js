'use strict';

import co from 'co';
import config from 'config';

import {call, register} from '../../../lib/app';
// import emailSchema from '../../schemas/common/email';


export default function* registerViaEmail (email) {

  let user = yield call({role: config.roles.VERIFICATION, cmd: config.cmds.IS_CERTIFIED}, email);
  return user;
}


export const META = {
  role: config.roles.AUTHENTICATION,
  cmd: config.cmds.REGISTER_VIA_EMAIL
}


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
}


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
}


register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, registerViaEmail);

setInterval(() => {

  co(function* () {

    let r = yield call({role: config.roles.AUTHENTICATION, cmd: config.cmds.REGISTER_VIA_EMAIL}, 'si@ibrokethat.com');
    console.log(r);

  });
}, 1000);
