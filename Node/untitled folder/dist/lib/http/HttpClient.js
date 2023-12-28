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
const node_fetch_1 = __importDefault(require("node-fetch"));
class HttpClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    get(path, queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(path, queryParams);
            const response = yield (0, node_fetch_1.default)(url);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    post(path, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(path);
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    put(path, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(path);
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    patch(path, body = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(path);
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl(path);
            const response = yield (0, node_fetch_1.default)(url, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        });
    }
    buildUrl(path, queryParams) {
        let url = this.baseUrl + path;
        if (queryParams) {
            const queryString = Object.keys(queryParams)
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
                .join('&');
            url += `?${queryString}`;
        }
        return url;
    }
}
exports.default = HttpClient;
//# sourceMappingURL=HttpClient.js.map