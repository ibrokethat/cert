'use strict';

import co from 'co';
import CONF from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {USER_SCHEMA} from '../schemas/user';


export const META = {
  entity: CONF.entities.USERS,
  cmd: CONF.cmds.FIND_BY_EMAIL
};


let db = {
  users: {
    find: function ({email}) {
      return Promise.resolve(false);
    }
  }
}


export default function* findByEmail (ctx, email) {

  return yield db.users.find({email: email});
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, USER_SCHEMA, findByEmail);
