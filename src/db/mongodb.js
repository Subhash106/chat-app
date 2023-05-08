const { MongoClient } = require("mongodb");

async function main() {
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = "mongodb://127.0.0.1:27017";

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    // await listDatabases(client);

    // await updateMany(client, { first: "Subash" }, { age: 98 });
    await deleteOne(client, { last: "Chandra" });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

const createRecord = async (client, user) => {
  const result = await client.db("test").collection("users").insertOne(user);
  console.log("result", result.insertedId);
};

const createManyRecords = async (client, users) => {
  const result = await client.db("test").collection("users").insertMany(users);
  console.log("result", result);
};

const findOne = async (client, query) => {
  const result = await client.db("test").collection("users").findOne(query);
  console.log("result", result);
};

const findMany = async (client, query) => {
  const cursor = client
    .db("test")
    .collection("users")
    .find(query)
    .sort({ age: -1 });

  const result = await cursor.toArray();
  console.log("result", result);
};

const updateOne = async (client, filter, update) => {
  const result = await client
    .db("test")
    .collection("users")
    .updateOne(filter, { $set: update });

  console.log("result", result);
};

const upsertOne = async (client, filter, update) => {
  const result = await client
    .db("test")
    .collection("users")
    .updateOne(filter, { $set: update }, { upsert: true });

  console.log("result", result);
};

const updateMany = async (client, filter, update) => {
  const result = await client
    .db("test")
    .collection("users")
    .updateMany(filter, { $set: update });

  console.log("result", result);
};

const deleteOne = async (client, filter) => {
  const result = await client.db("test").collection("users").deleteOne(filter);

  console.log("result", result);
};

main().catch(console.error);
