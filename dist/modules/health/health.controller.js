"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
let HealthController = HealthController_1 = class HealthController {
    constructor() {
        this.logger = new common_1.Logger(HealthController_1.name);
    }
    async getsSecureHealth() {
        this.logger.log(`Calling GET endpoint to validate health`);
        return {
            success: true,
            message: 'Successfully GET health call',
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('healthy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getsSecureHealth", null);
exports.HealthController = HealthController = HealthController_1 = __decorate([
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [])
], HealthController);
//# sourceMappingURL=health.controller.js.map