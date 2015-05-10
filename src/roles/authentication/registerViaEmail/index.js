'use strict';

import co from 'co';
import CONF from 'config';

import {bindToHttp} from '../../../../lib/api';
import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


export const META = {
  role: CONF.roles.AUTHENTICATION,
  cmd: CONF.cmds.REGISTER_VIA_EMAIL
}


export default function* registerViaEmail (email, password) {

  //  is the email address already registered
  let user = yield call({entity: CONF.entities.USER, cmd: CONF.cmds.FIND_BY_EMAIL}, email);

  if (user) {

    return new e.Conflict('Email address already taken');
  }

  user = yield call({entity: CONF.entities.USER, CONF.cmds.CREATE}, email, password);

  let email = yield call({role: CONF.roles.MESSAGE, cmd: CONF.cmds.SEND_EMAIL}, CONF.emails.REGISTRATION_AUTHENTICATION, user);

  if (!email) {

    return new e.InternalServerError();
  }

  return {
    //  registration success - now verifiy from email link
  }


}


//  register the service with the message queue
register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, registerViaEmail);

//  expose over http
bindToHttp(META, INPUT_SCHEMA, OUTPUT_SCHEMA);


setInterval(() => {

  co(function* () {

    let r = yield call({role: CONF.roles.AUTHENTICATION, cmd: CONF.cmds.REGISTER_VIA_EMAIL}, 'si@ibrokethat.com');
    console.log(r);

  });
}, 1000);
