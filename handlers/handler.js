'use strict';

module.exports = {
  async log(event) {
    console.log(JSON.stringify(event, null, 2));

    return {
      ok: true
    }
  }
}
