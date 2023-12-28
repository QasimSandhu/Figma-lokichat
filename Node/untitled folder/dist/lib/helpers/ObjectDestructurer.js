"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectManipulator {
    static distruct(obj) {
        let newObj = {};
        for (let key in obj) {
            newObj[key] = obj[key];
        }
        return newObj;
    }
}
exports.default = ObjectManipulator;
//# sourceMappingURL=ObjectDestructurer.js.map