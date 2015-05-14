'use strict';

export default function clone (data) {

  return JSON.parse(JSON.stringify(data));
}
