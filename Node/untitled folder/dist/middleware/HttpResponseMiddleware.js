"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpResponse_1 = __importDefault(require("../lib/response/HttpResponse"));
function httpResponseMiddleware(req, res, next) {
    res.httpResponse = new HttpResponse_1.default('', 200, {});
    next();
}
exports.default = httpResponseMiddleware;
//# sourceMappingURL=HttpResponseMiddleware.js.map