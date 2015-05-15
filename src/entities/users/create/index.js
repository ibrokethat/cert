'use strict';

import co from 'co';
import CONF from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {USER_SCHEMA} from '../schemas/user';


export const META = {
  entity: CONF.entities.USERS,
  cmd: CONF.cmds.CREATE
}

let db = {
  users: {
    insert: ({email}) => {
      return Promise.resolve({
        email: email,
        firstName: 'Simon',
        lastName: 'Jefford'
      });
    }
  }
};


export default function* create (ctx, email, password) {

  return yield db.users.insert({email: email, password: password});
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, USER_SCHEMA, create);
