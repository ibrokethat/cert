'use strict';

import koa from 'koa';
import Router from 'koa-router';
import {map} from '@ibrokethat/iter';

import CONF from 'config';

let app = koa();


function getApiConf (conf, meta) {

  let type = meta.role || meta.entity;

  let apiConf = CONF.apis[type][meta.cmd];

  if (!apiConf) {

    throw new e.ApiConfigurationError(`Missing configuration for: ${meta}`);
  }

  return apiConf;

}


export function bindToHttp (META, INPUT_SCHEMA, OUTPUT_SCHEMA) {

  let router new Router();

  let {port, method, access} = getApiConf(CONF, META);

  router[method](

    //  more koa middleware here? timing, compression, caching, etc

    function* (next) {

      let {params, query, body} = this.req;

      let ctx = {
        req = {
          params: clone(params),
          query: clone(query),
          body: clone(body)
        },
        authUser: yield call({role: CONF.roles.AUTHENTICATION, cmd: CONF.cmds.CHECK_ACCESS}, CONF.access[access]);
      };

      let args = map(INPUT_SCHEMA.items, (item) => req.params[item.title]);

      this.data = yield call(META, ctx, ...args);

      yield next;
    }

    //  more koa middleware here?
    //  link generation
  );

  // let swagger = generateSwagger(META, INPUT_SCHEMA, OUTPUT_SCHEMA);

  // app.get('/def', function* () {

  //   this.data = swagger;
  // });


  app.use(Router);

  app.listen(port);
}
