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
Object.defineProperty(exports, "__esModule", { value: true });
const cosmos_1 = require("@azure/cosmos");
const config_1 = __importDefault(require("../../config/config"));
class CosmoDB {
    constructor(containerId = 'items') {
        this.containerId = containerId;
        this.partitionKey = { kind: 'Hash', paths: ['/partitionKey'] };
        const endpoint = config_1.default.database.cosmo.endPoint;
        const key = config_1.default.database.cosmo.key;
        this.client = new cosmos_1.CosmosClient({ endpoint, key });
    }
    initializeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            this.container = this.client.database(config_1.default.database.cosmo.databaseId).container(this.containerId);
        });
    }
    checkAndCreateDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDatabase = yield this.readDatabase();
            if (!existingDatabase) {
                const { database } = yield this.client.databases.createIfNotExists({
                    id: config_1.default.database.cosmo.databaseId
                });
                console.log(`Created database:\n${database.id}\n`);
                return true;
            }
            return false;
        });
    }
    readDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resource: databaseDefinition } = yield this.client.database(config_1.default.database.cosmo.databaseId).read();
                return databaseDefinition;
            }
            catch (error) {
                return false;
            }
        });
    }
    checkAndCreateContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingContainer = yield this.readContainer();
            if (!existingContainer.id) {
                const { container } = yield this.client
                    .database(config_1.default.database.cosmo.databaseId)
                    .containers.createIfNotExists({ id: this.containerId, partitionKey: this.partitionKey });
                console.log(`Created container:\n${container.id}\n`);
                return true;
            }
            return false;
        });
    }
    readContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resource: containerDefinition } = yield this.client.database(config_1.default.database.cosmo.databaseId).container(this.containerId).read();
                return containerDefinition;
            }
            catch (error) {
                return false;
            }
        });
    }
    insertOne(document) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resource } = yield this.container.items.create(document);
            return resource;
        });
    }
    insertMany(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resources } = yield this.container.items.create(documents);
            return resources;
        });
    }
    deleteOne(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resource } = yield this.container.item(documentId).delete();
            return resource;
        });
    }
    deleteMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resources } = yield this.container.items.query(query).fetchAll();
            const deletePromises = resources.map((resource) => this.container.item(resource.id).delete());
            yield Promise.all(deletePromises);
            return resources;
        });
    }
    update(documentId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resource } = yield this.container.item(documentId).replace(updatedData);
            return resource;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resources } = yield this.container.items.query(query).fetchAll();
            return resources[0];
        });
    }
    findAll(query = { query: "SELECT * from c" }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.checkAndCreateDatabase();
                yield this.checkAndCreateContainer();
                const { resources } = yield this.container.items.query(query).fetchAll();
                return resources;
            }
            catch (error) {
                console.log('No data found');
                return 'No data found';
            }
        });
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
    executeQuery(querySpec) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndCreateDatabase();
            yield this.checkAndCreateContainer();
            const { resources } = yield this.container.items.query(querySpec).fetchAll();
            return resources;
        });
    }
}
exports.default = CosmoDB;
//# sourceMappingURL=cosmoDB.js.map