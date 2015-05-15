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


function someMEssage() {
  return Promise.resolve(true);
}

export default function* sendEmail (ctx, messageType, entity) {

  return yield someMessage(messageType, entity);

}

//  register the service with the message queue
register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, sendEmail);
