"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('todo:taskDao');
// For simplicity, we'll set a constant partition key
const partitionKey = undefined;
class TaskDao {
    /**
     * Manages reading, adding, and updating Tasks in Azure Cosmos DB
     * @param {CosmosClient} cosmosClient
     * @param {string} databaseId
     * @param {string} containerId
     */
    constructor(cosmosClient, databaseId, containerId) {
        this.client = cosmosClient;
        this.databaseId = databaseId;
        this.containerId = containerId;
        this.database = null;
        this.container = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Setting up the database...');
            const { database } = yield this.client.databases.createIfNotExists({
                id: this.databaseId
            });
            this.database = database;
            debug('Setting up the database...done!');
            debug('Setting up the container...');
            const { container } = yield this.database.containers.createIfNotExists({
                id: this.containerId
            });
            this.container = container;
            debug('Setting up the container...done!');
        });
    }
    find(querySpec) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Querying for items from the database');
            if (!this.container) {
                throw new Error('Collection is not initialized.');
            }
            const { resources } = yield this.container.items.query(querySpec).fetchAll();
            return resources;
        });
    }
    addItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Adding an item to the database');
            item.date = Date.now();
            item.completed = false;
            const { resource: doc } = yield this.container.items.create(item);
            return doc;
        });
    }
    updateItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Update an item in the database');
            const doc = yield this.getItem(itemId);
            doc.completed = true;
            const { resource: replaced } = yield this.container.item(itemId, partitionKey).replace(doc);
            return replaced;
        });
    }
    getItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            debug('Getting an item from the database');
            const { resource } = yield this.container.item(itemId, partitionKey).read();
            return resource;
        });
    }
}
module.exports = TaskDao;
//# sourceMappingURL=cosmos.connection.js.map