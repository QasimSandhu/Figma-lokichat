import { CosmosClient, Database, Container, FeedResponse } from '@azure/cosmos';
import Debug from 'debug';

const debug = Debug('todo:taskDao');

// For simplicity, we'll set a constant partition key
const partitionKey: string | undefined = undefined;

interface Task {
  id?: string;
  date: number;
  completed: boolean;
  // Add other properties of the task
}

class TaskDao {
  private client: CosmosClient;
  private databaseId: string;
  private containerId: string;
  private database: Database | null;
  private container: Container | null;

  /**
   * Manages reading, adding, and updating Tasks in Azure Cosmos DB
   * @param {CosmosClient} cosmosClient
   * @param {string} databaseId
   * @param {string} containerId
   */
  constructor(cosmosClient: CosmosClient, databaseId: string, containerId: string) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.containerId = containerId;
    this.database = null;
    this.container = null;
  }

  async init(): Promise<void> {
    debug('Setting up the database...');
    const { database } = await this.client.databases.createIfNotExists({
      id: this.databaseId
    });
    this.database = database;
    debug('Setting up the database...done!');
    debug('Setting up the container...');
    const { container } = await this.database.containers.createIfNotExists({
      id: this.containerId
    });
    this.container = container;
    debug('Setting up the container...done!');
  }

  async find(querySpec: any): Promise<Task[]> {
    debug('Querying for items from the database');
    if (!this.container) {
      throw new Error('Collection is not initialized.');
    }
    const { resources } = await this.container.items.query(querySpec).fetchAll();
    return resources as Task[];
  }

  async addItem(item: Task): Promise<Task> {
    debug('Adding an item to the database');
    item.date = Date.now();
    item.completed = false;
    const { resource: doc } = await this.container.items.create(item);
    return doc as Task;
  }

  async updateItem(itemId: string): Promise<Task> {
    debug('Update an item in the database');
    const doc = await this.getItem(itemId);
    doc.completed = true;
    const { resource: replaced } = await this.container.item(itemId, partitionKey).replace(doc);
    return replaced as Task;
  }

  async getItem(itemId: string): Promise<Task> {
    debug('Getting an item from the database');
    const { resource } = await this.container.item(itemId, partitionKey).read();
    return resource as Task;
  }
}

export = TaskDao;
