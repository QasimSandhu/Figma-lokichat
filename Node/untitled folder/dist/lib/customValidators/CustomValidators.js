"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsStringOrNumber = void 0;
const class_validator_1 = require("class-validator");
function IsStringOrNumber(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'isStringOrNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return typeof value === 'string' || typeof value === 'number';
                },
            },
        });
    };
}
exports.IsStringOrNumber = IsStringOrNumber;
//# sourceMappingURL=CustomValidators.js.map