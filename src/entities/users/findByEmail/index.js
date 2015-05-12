'use strict';

import co from 'co';
import CONF from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {USER_SCHEMA} from '../schemas/user';


export const META = {
  entities: CONF.entities.USER,
  cmd: CONF.cmds.FIND_BY_EMAIL
}


export default function* findByEmail (ctx, email) {

  let {req, authUser} = ctx;

  return yield db.user.find({email: email});
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, USER_SCHEMA, findByEmail);



// setInterval(() => {

//   co(function* () {

//     let r = yield call({role: CONF.roles.VERIFICATION, cmd: CONF.cmds.IS_CERTIFIED}, 'sarah@hackneygrove.com');
//     console.log(r);

//   });
// }, 200);
