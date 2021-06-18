const {upsert, history} = require('../qldb-models/audit-log')

module.exports = {
  async write (event) {
    try {
      const {
        entity,
        attributes
      } = event.detail;
      const {detail, ...eventMeta} = event;

      attributes.event = eventMeta
      const result = await upsert(entity, attributes);
      console.log(result);
    } catch (e) {
      console.log(e.message);
    }
  },
  async read (event) {
    let statusCode = 200;
    let body = {ok: true};
    const {entity, id} = event.pathParameters;

    try {
      const historyResult = await history(entity, id);

      if (historyResult.length > 0) {
        body.data = historyResult
      } else {
        statusCode = 404;
        body = {
          ok: false,
          error: 'Not Found'
        }
      }
    } catch (e) {
      console.log(e.message);
      statusCode = 400;
      body = {
        ok: false,
        error: 'Bad Request'
      }
    }

    return {
      statusCode,
      body: JSON.stringify(body, null, 2)
    };
  }
}
