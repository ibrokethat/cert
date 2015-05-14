'use strict';

import {forEach} from '@ibrokethat/iter';

export default function freeze (object) {

  Object.freeze(object);

  forEach(object, (v, k) => {

    if (object.hasOwnProperty(k) && (typeof v === 'object') && !Object.isFrozen(v)) {

      freeze(v);
    }

  });

  return object;
}
