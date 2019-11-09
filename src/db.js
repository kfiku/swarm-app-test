const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const { MONGO_HOST, MONGO_PORT, DB_NAME } = process.env

async function insertDocument(document) {
  const documents = await getDocumentsDb();
  const result = await documents.insertOne(document);
  assert.equal(1, result.ops.length);

  return result;
}

async function findDocuments() {
  const documents = await getDocumentsDb();
  const docs = await documents.find({});

  return docs.toArray();
}

async function truncateDocuments() {
  const documents = await getDocumentsDb();
  return await documents.remove({});
}


async function getDocumentsDb() {
  const { db } = await getConnection();

  const documents = db.collection('documents');

  return documents
}

async function close() {
  const { close } = await getConnection();

  connection = undefined;
  close();
}

let connection;
async function getConnection() {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection);
      return
    }

    const url = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;
    const dbName = DB_NAME;
    const client = new MongoClient(url);

    client.connect(function(err) {
      assert.equal(null, err);

      db = client.db(dbName);

      connection = {
        db,
        close: () => client.close()
      }

      resolve(connection)
    });
  });
}

module.exports = {
  insertDocument,
  findDocuments,
  truncateDocuments,
  close
};
