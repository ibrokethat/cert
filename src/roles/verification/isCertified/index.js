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


export default function* isCertified (ctx, email) {

  let {req, authUser} = ctx;

  let user = yield call({entity: CONF.entities.USER, cmd: CONF.cmds.FIND_BY_EMAIL}, ctx, email);

  return {
    email: email,
    isCertified: !!user
  };
}

//  register the service with the message queue
register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, isCertified);

//  expose over http
bindToHttp(META, INPUT_SCHEMA, OUTPUT_SCHEMA);

