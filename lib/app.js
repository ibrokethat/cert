'use strict';

import logger from 'su-logger';
import url from 'url';
import amqp from 'amqplib';
import co from 'co';
import uuid from 'uuid';
import CONF from 'config';
import handler from './handler';
import clone from './clone';

//  init the logger
logger();


// export function register (meta, inputSchema, outputSchema, fn) {

//   //  our queue names should be the meta description + direction
//   let receiver = clone(meta);
//   receiver.dir = 'outbound';
//   let outboundQ = JSON.stringify(receiver);

//   let responder = clone(meta);
//   responder.dir = 'inbound';
//   let inboundQ = JSON.stringify(responder);

//   let fnHandler = handler(meta, inputSchema, outputSchema, fn);

//   co(function* () {

//     let conn = yield amqp.connect(CONF.uris.amqp);
//     let ch = yield conn.createChannel();
//     let ok = yield ch.assertQueue(outboundQ, {durable: false});

//     ch.consume(outboundQ, work, {noAck: true});

//     process.emit('app:log', outboundQ, 'awaiting requests on channel');

//     function work (msg) {

//       co(function* () {

//         let args = JSON.parse(msg.content);

//         process.emit('app:log', meta);

//         let data = yield fnHandler(...args);

//         respond(inboundQ, msg.properties.correlationId, data);

//       });

//     }
//   });

// }


// function respond (inboundQ, correlationId, data) {

//   co(function* () {

//     let conn = yield amqp.connect(CONF.uris.amqp);
//     let ch = yield conn.createChannel();
//     let ok = yield ch.assertQueue(inboundQ, {durable: false});

//     ch.sendToQueue(inboundQ, new Buffer(JSON.stringify(data)), {
//       correlationId: correlationId
//     });

//     // ch.close();
//     // conn.close();

//   });
// }


// export function call (meta, ...args) {

//   //  our queue names should be the meta description + direction
//   let receiver = clone(meta);
//   receiver.dir = 'outbound';
//   let outboundQ = JSON.stringify(receiver);

//   let responder = clone(meta);
//   responder.dir = 'inbound';
//   let inboundQ = JSON.stringify(responder);

//   let correlationId = uuid.v4();

//   return co(function* () {

//     let conn = yield amqp.connect(CONF.uris.amqp);
//     let ch = yield conn.createChannel();
//     let ok = yield ch.assertQueue(outboundQ, {durable: false});

//     setImmediate(() => {
//       ch.sendToQueue(outboundQ, new Buffer(JSON.stringify(args)), {
//         correlationId: correlationId
//       });
//     });

//     return yield onResponse(inboundQ, correlationId);

//     conn.close();
//   });

// }


// function onResponse(inboundQ, correlationId) {

//   return new Promise(function (resolve, reject) {

//     let conn;

//     function result(msg) {

//       if (msg.properties.correlationId === correlationId) {

//         resolve(JSON.parse(msg.content.toString()));
//         conn.close()
//       }
//     }

//     co(function* () {

//       conn = yield amqp.connect(CONF.uris.amqp);
//       let ch = yield conn.createChannel();
//       let ok = yield ch.assertQueue(inboundQ, {durable: false})

//       ch.consume(inboundQ, result, {noAck: true});

//     });

//   });
// }










export function register (meta, inputSchema, outputSchema, fn) {

  //  our queue name should be the meta description
  let q = JSON.stringify(meta);
  let fnHandler = handler(meta, inputSchema, outputSchema, fn);

  return co(function* () {

    let conn = yield amqp.connect(CONF.uris.amqp);
    let ch = yield conn.createChannel();
    let ok = yield ch.assertQueue(q, {durable: false});

    ch.prefetch(1);
    ch.consume(q, work);

    process.emit('app:log', q, 'awaiting requests on channel');

    function work (msg) {

      co(function* () {

        let replyTo = msg.properties.replyTo;
        let correlation = {correlationId: msg.properties.correlationId};

        let args = JSON.parse(msg.content);

        process.emit('app:log', meta);

        let data = yield fnHandler(...args);

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

  console.log(meta)

  return new Promise(function (resolve, reject) {

    function result(msg) {

      if (msg.properties.correlationId === correlationId) {

        resolve(JSON.parse(msg.content.toString()));

        conn.close()
      }
    }

    co(function* () {

      conn = yield amqp.connect(CONF.uris.amqp);
      let ch = yield conn.createChannel();
      let {queue} = yield ch.assertQueue('', {exclusive: true})

      yield ch.consume(queue, result, {noAck: true});

      ch.sendToQueue(q, new Buffer(JSON.stringify(args)), {
        correlationId: correlationId, replyTo: queue
      });

    });

  });

};
