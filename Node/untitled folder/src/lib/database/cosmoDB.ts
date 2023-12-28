import { CosmosClient } from '@azure/cosmos';
import config from '../../config/config';

export default class CosmoDB {
  client;
  container;
  partitionKey;
  containerId;

  constructor(containerId = 'items') {
    this.containerId = containerId;
    this.partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }
    const endpoint = config.database.cosmo.endPoint;
    const key = config.database.cosmo.key;
    this.client = new CosmosClient({ endpoint, key });
  }

  async initializeAsync() {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    this.container = this.client.database(config.database.cosmo.databaseId).container(this.containerId);
  }

  async checkAndCreateDatabase() {
    const existingDatabase = await this.readDatabase();
    if (!existingDatabase) {
      const { database } = await this.client.databases.createIfNotExists({
        id: config.database.cosmo.databaseId
      });
      console.log(`Created database:\n${database.id}\n`);
      return true;
    }
    return false;
  }

  async readDatabase() {
    try {
      const { resource: databaseDefinition } = await this.client.database(config.database.cosmo.databaseId).read();
      return databaseDefinition;
    } catch (error) {
      return false;
    }
  }

  async checkAndCreateContainer() {
    const existingContainer = await this.readContainer();
    if (!existingContainer.id) {
      const { container } = await this.client
        .database(config.database.cosmo.databaseId)
        .containers.createIfNotExists(
          { id: this.containerId, partitionKey: this.partitionKey }
        );
      console.log(`Created container:\n${container.id}\n`);
      return true;
    }
    return false;
  }

  async readContainer() {
    try {
      const { resource: containerDefinition } = await this.client.database(config.database.cosmo.databaseId).container(this.containerId).read();
      return containerDefinition;
    } catch (error) {
      return false;
    }
  }

  async insertOne(document) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resource } = await this.container.items.create(document);
    return resource;
  }

  async insertMany(documents) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resources } = await this.container.items.create(documents);
    return resources;
  }

  async deleteOne(documentId) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resource } = await this.container.item(documentId).delete();
    return resource;
  }

  async deleteMany(query) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resources } = await this.container.items.query(query).fetchAll();
    const deletePromises = resources.map((resource) => this.container.item(resource.id).delete());
    await Promise.all(deletePromises);
    return resources;
  }

  async update(documentId, updatedData) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resource } = await this.container.item(documentId).replace(updatedData);
    return resource;
  }

  async findOne(query) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resources } = await this.container.items.query(query).fetchAll();
    return resources[0];
  }

  async findAll(query = { query: "SELECT * from c" }) {
    try {
      await this.checkAndCreateDatabase();
      await this.checkAndCreateContainer();
      const { resources } = await this.container.items.query(query).fetchAll();
      return resources;
    } catch (error) {
      console.log('No data found');
      return 'No data found';
    }
  }

  where(condition) {
    const querySpec = {
      query: `SELECT * FROM c WHERE ${condition}`,
    };
    return this.executeQuery(querySpec);
  }

  whereHas(property, value) {
    const querySpec = {
      query: `SELECT * FROM c WHERE ARRAY_CONTAINS(c.${property}, @value)`,
      parameters: [{ name: '@value', value: value }],
    };
    return this.executeQuery(querySpec);
  }

  whereNotHas(property, value) {
    const querySpec = {
      query: `SELECT * FROM c WHERE NOT ARRAY_CONTAINS(c.${property}, @value)`,
      parameters: [{ name: '@value', value: value }],
    };
    return this.executeQuery(querySpec);
  }

  async executeQuery(querySpec) {
    await this.checkAndCreateDatabase();
    await this.checkAndCreateContainer();
    const { resources } = await this.container.items.query(querySpec).fetchAll();
    return resources;
  }
}
