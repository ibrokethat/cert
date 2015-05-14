'use strict';

import koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-better-body';
import latency from 'koa-latency-headers';
import {map} from '@ibrokethat/iter';

import CONF from 'config';

import {call} from './app';
import clone from './clone';

let app = koa();

app.use(latency());

const AUTH_ACCESS = {role: CONF.roles.AUTHENTICATION, cmd: CONF.cmds.CHECK_ACCESS};


function getApiConf (conf, meta) {

  let type = meta.role || meta.entity;

  try {

    return CONF.apis[type][meta.cmd];
  }
  catch (err) {

    throw new e.ApiConfigurationError(`Missing configuration for: ${meta}`);
  }

}


export function bindToHttp (META, INPUT_SCHEMA, OUTPUT_SCHEMA) {

  let router = new Router();

  let {port, method, access} = getApiConf(CONF, META);

  //  lets generate the route params
  let routeParams = method === 'GET' ? map(INPUT_SCHEMA.items, (item) => `/:${item.title}`).join('') : '/';

  router[method.toLowerCase()](

    routeParams,

    koaBody({
      extendTypes: {
        // will parse application/x-javascript type body as a JSON string
        json: ['application/x-javascript'],
        multipart: ['multipart/mixed']
      }
    }),

    //  more koa middleware here? timing, compression, caching, etc

    function* (next) {

      let {params: params, request: {query: query, body: {fields: body}}} = this;

      let args = map(INPUT_SCHEMA.items, ({title}) => {

        switch (true) {

          case (params.hasOwnProperty(title)):

            return params[title];

          case (query.hasOwnProperty(title)):

            return query[title];

          case (body.hasOwnProperty(title)):

            return body[title];

          default:

            return true;

        }

      });

      let ctx = {
        req: {
          params: clone(params),
          query: clone(query),
          body: clone(body)
        },
        // authUser: yield call(AUTH_ACCESS, CONF.access[access])
      };

      this.body = yield call(META, ctx, ...args);

      yield next;
    }

    //  more koa middleware here?
    //  link generation
  );

  // let swagger = generateSwagger(META, INPUT_SCHEMA, OUTPUT_SCHEMA);

  // app.get('/def', function* () {

  //   this.data = swagger;
  // });


  app.use(router.routes());

  app.listen(port);
}
