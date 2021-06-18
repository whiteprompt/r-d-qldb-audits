const {getQldbDriver} = require('../services/qldb');
const driver = getQldbDriver();

module.exports = {
  async upsert(entity, attributes) {
    return await driver.executeLambda(async (txn) => {
      if (!attributes || !attributes.id) {
        throw new Error('attributes must be an object with an id attribute')
      } else {
        attributes.id = attributes.id.toString();
      }

      let recordsReturned;
      let result;
      const existQuery = `SELECT id FROM ${entity} AS e WHERE e.id = ${attributes.id}`;
      const exist = await txn.execute(existQuery);
      recordsReturned = exist.getResultList().length;

      if (recordsReturned === 0) {
        result = await txn.execute(`INSERT INTO ${entity} VALUE ?`, attributes);
      } else {
        const {id, ...updateParameters} = attributes;
        result = await txn.execute(`UPDATE ${entity} AS e SET e = ? WHERE e.id = ?`, updateParameters, id);
      }

      console.log(JSON.stringify({
        entity,
        attributes,
        recordsReturned,
        result
      }));

      return result.getResultList();
    });
  },
  async history(entity, id) {
    return await driver.executeLambda(async (txn) => {
      let result = [];
      const documentIdQuery = await txn.execute(`SELECT documentId FROM ${entity} AS e BY documentId WHERE e.id = ?`, id.toString());
      const documentIdResult = documentIdQuery.getResultList();
      const documentId = documentIdResult[0] && documentIdResult[0].documentId;

      if (documentIdResult.length > 0 && documentId) {
        const historyQuery = await txn.execute(`SELECT * FROM history(test) AS h WHERE h.metadata.id = ?`, documentId);
        result = historyQuery.getResultList();
      }

      return result;
    })
  }
}
