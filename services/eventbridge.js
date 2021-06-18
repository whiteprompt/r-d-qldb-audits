const AWS = require('aws-sdk');
const eventBridgeInitOptions = {
  region: process.env.REGION
};

if (process.env.NODE_ENV !== 'production') {
  eventBridgeInitOptions.endpoint = 'http://127.0.0.1:4010';
}

const eventBridge = new AWS.EventBridge(eventBridgeInitOptions);

module.exports = {
  client: eventBridge,
  async put (events) {
    if (events.length < 1) {
      throw new Error('events must be a valid array of eventbridge events');
    }

    return await eventBridge.putEvents({Entries: events}).promise();
  },
  buildEvent (opts = {}) {
    if (typeof opts !== 'object' || !opts.source || !opts.detailType || !opts.detail) {
      throw new Error('A valid event options object must be passed as parameter: {bus?, source, detailType, detail}')
    }

    const EventBusName = opts.bus || process.env.DEFAULT_EVENT_BUS_NAME || 'default';
    const Time = opts.time || new Date();
    const Detail = JSON.stringify(opts.detail);

    return {
      EventBusName,
      Source: opts.source,
      DetailType: opts.detailType,
      Detail,
      Time
    };
  }
};
