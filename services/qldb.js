const AWS = require('aws-sdk');
const { QldbDriver, RetryConfig } = require('amazon-qldb-driver-nodejs');
const qldbInitOptions = {
  region: process.env.REGION
};

if (process.env.NODE_ENV !== 'production') {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: process.env.PROFILE});
}


/**
 * Create a driver for interacting with QLDB.
 * @param ledgerName The name of the ledger to create the driver on.
 * @param serviceConfigurationOptions Configurations for the AWS SDK client that the driver uses.
 * @param maxConcurrentConnections
 * @param retryConfig
 * @returns The driver for interacting with the specified ledger.
 */
function createQldbDriver(
  ledgerName = process.env.LEDGER_NAME,
  serviceConfigurationOptions = qldbInitOptions,
  maxConcurrentConnections = 10,
  retryConfig = new RetryConfig(4)
) {
  return new QldbDriver(
    ledgerName,
    serviceConfigurationOptions,
    maxConcurrentConnections,
    retryConfig
  );
}

const qldbDriver = createQldbDriver();


module.exports = {
  /**
   * Retrieve a driver for interacting with QLDB.
   * @returns The driver for interacting with the specified ledger.
   */
  getQldbDriver() {
    return qldbDriver;
  }
};

