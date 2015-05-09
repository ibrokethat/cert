'use strict';

import url from 'url';
import amqp from 'amqplib';
import co from 'co';
import uuid from 'uuid';
import config from 'config';


export function register (meta, input_schema = null, output_schema = null, fn) {

  //  our queue name should be the meta description
  let q = JSON.stringify(meta);
  // let fnHandler = handler(input_schema, output_schema, fn);
  let fnHandler = fn;

  return co(function* () {

    let conn = yield amqp.connect(config.uris.amqp);
    let ch = yield conn.createChannel();
    let ok = yield ch.assertQueue(q, {durable: false});

    ch.prefetch(1);
    ch.consume(q, process);

    console.log('awaiting request on channel: ', q);

    function process (msg) {

      co(function* () {

        let reply_to = msg.properties.replyTo;
        let correlation = {correlationId: msg.properties.correlationId};

        let start = Date.now();

        console.log('started processing request on channel: ', q);

        let data = yield fnHandler(...JSON.parse(msg.content));

        let time = (Date.now() - start) + 'ms';

        console.log('finished processing request on channel: ', q, ' duration: ', time);

        data = new Buffer(JSON.stringify(data));

        ch.sendToQueue(reply_to, data, correlation);
        ch.ack(msg);

      });

    }

    return conn;

  }).catch((e) => console.log(e.stack) || process.exit(1));

}

//


export function call (meta, ...args) {

  let q = JSON.stringify(meta);

  let correlation_id = uuid.v4();

  let start;
  let conn;

  return new Promise(function (resolve, reject) {

    function result(msg) {

      if (msg.properties.correlationId === correlation_id) {

        resolve(JSON.parse(msg.content.toString()));

        let time = (Date.now() - start) + 'ms';
        console.log('resolved request on channel: ', q, ' duration: ', time);

        conn.close()
      }
    }

    co(function* () {

      conn = yield amqp.connect(config.uris.amqp);
      let ch = yield conn.createChannel();
      let {queue} = yield ch.assertQueue('', {exclusive: true})

      start = Date.now();
      console.log('initialised request on channel: ', q);

      ch.consume(queue, result, {noAck: true});

      ch.sendToQueue(q, new Buffer(JSON.stringify(args)), {
        correlationId: correlation_id, replyTo: queue
      });

    });

  });

};
