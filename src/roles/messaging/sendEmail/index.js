'use strict';

import co from 'co';
import CONF from 'config';

import {bindToHttp} from '../../../../lib/api';
import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


export const META = {
  role: CONF.roles.VERIFICATION,
  cmd: CONF.cmds.IS_CERTIFIED
}


export default function* sendEmail (ctx, messageType, entity) {

  let {req, authUser} = ctx;

  let messageSent = yield someMessage(messageType, entity);

  return messageSent;
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, sendEmail);

//  expose over http
bindToHttp(META, INPUT_SCHEMA, OUTPUT_SCHEMA);



// setInterval(() => {

//   co(function* () {

//     let r = yield call({role: CONF.roles.VERIFICATION, cmd: CONF.cmds.IS_CERTIFIED}, 'sarah@hackneygrove.com');
//     console.log(r);

//   });
// }, 200);
