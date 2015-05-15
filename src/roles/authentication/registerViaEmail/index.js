'use strict';

import co from 'co';
import CONF from 'config';

import {bindToHttp} from '../../../../lib/api';
import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


const USER_FIND_BY_EMAIL = {entity: CONF.entities.USERS, cmd: CONF.cmds.FIND_BY_EMAIL};
const USER_CREATE = {entity: CONF.entities.USERS, cmd: CONF.cmds.CREATE};
const MESSAGING_SEND_EMAIL = {role: CONF.roles.MESSAGING, cmd: CONF.cmds.SEND_EMAIL};


export const META = {
  role: CONF.roles.AUTHENTICATION,
  cmd: CONF.cmds.REGISTER_VIA_EMAIL
}


export default function* registerViaEmail (ctx, email, password) {

  //  is the email address already registered
  let user = yield call(USER_FIND_BY_EMAIL, ctx, email);
  console.log(user)
  if (user) {

    return new e.Conflict('Email address already taken');
  }

  user = yield call(USER_CREATE, ctx, email, password);

  // let emailSent = yield call(MESSAGING_SEND_EMAIL, ctx, CONF.emails.REGISTRATION_AUTHENTICATION, user);

  // if (!emailSent) {

  //   return new e.InternalServerError();
  // }

  return user


}


//  register the service with the message queue
register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, registerViaEmail);

//  expose over http
bindToHttp(META, INPUT_SCHEMA, OUTPUT_SCHEMA);
