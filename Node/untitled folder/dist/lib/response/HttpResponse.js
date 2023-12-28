"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResponse {
    constructor(content, status = 200, headers = {}) {
        this.content = content;
        this.status = status;
        this.headers = headers;
    }
    send(res) {
        res.writeHead(this.status, this.headers);
        res.end(this.content);
    }
}
exports.default = HttpResponse;
//# sourceMappingURL=HttpResponse.js.map