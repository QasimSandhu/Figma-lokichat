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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRequest = void 0;
const class_validator_1 = require("class-validator");
function handleRequest(req, res, requestObject, serviceFunction, resourceObject) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (requestObject) {
                const request = new requestObject(req);
                const errors = yield (0, class_validator_1.validate)(request);
                if (errors.length > 0) {
                    const errorResponse = {};
                    errors.forEach((error) => {
                        Object.keys(error.constraints).forEach(key => {
                            errorResponse[error.property] = error.constraints[key];
                        });
                    });
                    return res.status(422).json({ errors: errorResponse });
                }
            }
            const result = yield serviceFunction(req);
            if (resourceObject) {
                return res.status(200).json(new resourceObject(result));
            }
            else {
                return res.status(200).json(result);
            }
        }
        catch (error) {
            if (resourceObject) {
                return res.status(500).json(new resourceObject(null, error.message));
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: error.message || 'Something went wrong',
                    data: null
                });
            }
        }
    });
}
exports.handleRequest = handleRequest;
//# sourceMappingURL=requestHelper.js.map