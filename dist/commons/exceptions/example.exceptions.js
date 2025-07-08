"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeocodingException = void 0;
const common_1 = require("@nestjs/common");
class GeocodingException extends common_1.HttpException {
    constructor(message) {
        super(`Geocoding error: ${message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.GeocodingException = GeocodingException;
//# sourceMappingURL=example.exceptions.js.map