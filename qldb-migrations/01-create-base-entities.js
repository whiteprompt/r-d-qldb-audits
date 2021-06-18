const {getQldbDriver} = require('../services/qldb');


module.exports = {
  async up() {
    try {
      const qldbDriver = getQldbDriver();
      return await qldbDriver.executeLambda(async (txn) => {
        let createChannels = await txn.execute('CREATE TABLE channels');
        let indexChannelsId = await txn.execute('CREATE INDEX ON channels (id)');
        let indexChannelsUserId = await txn.execute('CREATE INDEX ON channels (user_id)');
        let createUsers = await txn.execute('CREATE TABLE users');
        let indexUsersId = await txn.execute('CREATE INDEX ON users (id)');
        let indexUsersCognitoUsername = await txn.execute('CREATE INDEX ON users (cognito_username)');
        let indexUsersEmail = await txn.execute('CREATE INDEX ON users (email)');
        let createTransactions = await txn.execute('CREATE TABLE transactions');
        let indexTransactionsId = await txn.execute('CREATE INDEX ON transactions (id)');
        let indexTransactionsUserId = await txn.execute('CREATE INDEX ON transactions (user_id)');
        let indexTransactionsSubscriptionId = await txn.execute('CREATE INDEX ON transactions (subscription_id)');
        let indexTransactionsProductId = await txn.execute('CREATE INDEX ON transactions (product_id)');
        let createSubscriptions = await txn.execute('CREATE TABLE subscriptions');
        let indexSubscriptionId = await txn.execute('CREATE INDEX ON subscriptions (id)');
        let indexSubscriptionUserId = await txn.execute('CREATE INDEX ON subscriptions (user_id)');
        let indexSubscriptionChannelId = await txn.execute('CREATE INDEX ON subscriptions (channel_id)');
        let indexSubscriptionProductId = await txn.execute('CREATE INDEX ON subscriptions (product_id)');
        let createProducts = await txn.execute('CREATE TABLE products');
        let indexProductId = await txn.execute('CREATE INDEX ON products (id)');
        let indexProductName = await txn.execute('CREATE INDEX ON products (name)');

        return {
          createChannels,
          indexChannelsId,
          indexChannelsUserId,
          createUsers,
          indexUsersId,
          indexUsersCognitoUsername,
          indexUsersEmail,
          createTransactions,
          indexTransactionsId,
          indexTransactionsUserId,
          indexTransactionsSubscriptionId,
          indexTransactionsProductId,
          createSubscriptions,
          indexSubscriptionId,
          indexSubscriptionUserId,
          indexSubscriptionChannelId,
          indexSubscriptionProductId,
          createProducts,
          indexProductId,
          indexProductName
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  },
  async down() {
    try {
      const qldbDriver = getQldbDriver();
      return await qldbDriver.executeLambda(async (txn) => {
        let deleteChannels = await txn.execute('DROP TABLE channels');
        let deleteUsers = await txn.execute('DROP TABLE users');
        let deleteTransactions = await txn.execute('DROP TABLE transactions');
        let deleteSubscriptions = await txn.execute('DROP TABLE subscriptions');
        let deleteProducts = await txn.execute('DROP TABLE products');

        return {
          deleteChannels,
          deleteUsers,
          deleteTransactions,
          deleteSubscriptions,
          deleteProducts
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  }
}

