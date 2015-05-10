'use strict';

import logger from 'su-logger';
import url from 'url';
import amqp from 'amqplib';
import co from 'co';
import uuid from 'uuid';
import config from 'config';
import handler from './handler';

//  init the logger
logger();

export function register (meta, inputSchema, outputSchema, fn) {

  //  our queue name should be the meta description
  let q = JSON.stringify(meta);
  let fnHandler = handler(meta, inputSchema, outputSchema, fn);

  return co(function* () {

    let conn = yield amqp.connect(config.uris.amqp);
    let ch = yield conn.createChannel();
    let ok = yield ch.assertQueue(q, {durable: false});

    ch.prefetch(1);
    ch.consume(q, work);

    process.emit('app:log', q, 'awaiting requests on channel');

    function work (msg) {

      co(function* () {

        let replyTo = msg.properties.replyTo;
        let correlation = {correlationId: msg.properties.correlationId};


        let data = yield fnHandler(...JSON.parse(msg.content));

        data = new Buffer(JSON.stringify(data));

        ch.sendToQueue(replyTo, data, correlation);
        ch.ack(msg);

      });

    }

    return conn;

  }).catch((e) => console.log(e.stack) || process.exit(1));

}

//


export function call (meta, ...args) {

  let q = JSON.stringify(meta);

  let correlationId = uuid.v4();

  let start;
  let conn;

  return new Promise(function (resolve, reject) {

    function result(msg) {

      if (msg.properties.correlationId === correlationId) {

        resolve(JSON.parse(msg.content.toString()));

        conn.close()
      }
    }

    co(function* () {

      conn = yield amqp.connect(config.uris.amqp);
      let ch = yield conn.createChannel();
      let {queue} = yield ch.assertQueue('', {exclusive: true})

      yield ch.consume(queue, result, {noAck: true});

      ch.sendToQueue(q, new Buffer(JSON.stringify(args)), {
        correlationId: correlationId, replyTo: queue
      });

    });

  });

};
