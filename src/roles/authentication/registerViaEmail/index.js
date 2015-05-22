'use strict';

import co from 'co';
import CONF from 'config';

import {register} from '@package/etcd';
import {bindToHttp, get, post} from '@package/http';
import {call} from '@package/amqp';

import {INPUT_SCHEMA} from './schemas/input';
import {OUTPUT_SCHEMA} from './schemas/output';


//  register with etcd
register(CONF.meta);

//  load services
let users;
let messaging;

bindServices(CONF.services).on('active', (services) => {users, messaging} = services));

export default function* registerViaEmail (ctx, email, password) {

  //  is the email address already registered
  let user = yield users.findByEmail(ctx, email);

  if (user) {

    return new e.Conflict('Email address already taken');
  }

  user = yield users.create(ctx, email, password);

  let emailSent = yield messaging.sendEmai(ctx, CONF.emails.REGISTRATION_AUTHENTICATION, user);

  if (!emailSent) {

    return new e.InternalServerError();
  }

  return user


}


//  expose over http
bindToHttp(CONF.meta, INPUT_SCHEMA, OUTPUT_SCHEMA, registerViaEmail);
