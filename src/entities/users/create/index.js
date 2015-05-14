'use strict';

import co from 'co';
import CONF from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {USER_SCHEMA} from '../schemas/user';


export const META = {
  entity: CONF.entities.USER,
  cmd: CONF.cmds.CREATE
}


export default function* create (ctx, email, password) {

  let {req, authUser} = ctx;

  return yield db.user.create({email: email, password: password});
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, USER_SCHEMA, create);
