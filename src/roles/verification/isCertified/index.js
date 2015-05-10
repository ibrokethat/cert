'use strict';

import co from 'co';
import config from 'config';

import {call, register} from '../../../../lib/app';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


export const META = {
  role: config.roles.VERIFICATION,
  cmd: config.cmds.IS_CERTIFIED
}


export default function* isCertified (email) {

  let user = yield db.user.find({email: email});

  return {
    email: email,
    isCertified: !!user
  };
}



let db = {
  user: {
    find: function (email) {
      return Promise.resolve({
        email: email
      });
    }
  }
}


register(META, INPUT_SCHEMA, OUTPUT_SCHEMA, isCertified);


// setInterval(() => {

//   co(function* () {

//     let r = yield call({role: config.roles.VERIFICATION, cmd: config.cmds.IS_CERTIFIED}, 'sarah@hackneygrove.com');
//     console.log(r);

//   });
// }, 200);
