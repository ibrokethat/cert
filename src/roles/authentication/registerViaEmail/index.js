'use strict';

import co from 'co';
import config from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


export const META = {
  role: config.roles.AUTHENTICATION,
  cmd: config.cmds.REGISTER_VIA_EMAIL
}


export default function* registerViaEmail (email) {

  let user = yield call({role: config.roles.VERIFICATION, cmd: config.cmds.IS_CERTIFIED}, email);
  return user;
}

register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, registerViaEmail);

setInterval(() => {

  co(function* () {

    let r = yield call({role: config.roles.AUTHENTICATION, cmd: config.cmds.REGISTER_VIA_EMAIL}, 'si@ibrokethat.com');
    console.log(r);

  });
}, 1000);
