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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_repository_interface_1 = require("../../repositories/user-repository.interface");
const logger_1 = require("../../infrastructure/logger");
let AuthService = class AuthService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    async signUp(signUpDto) {
        try {
            const { email, password, firstName, lastName } = signUpDto;
            logger_1.Logger.log(`Attempting to register user: ${email}`, 'AuthService');
            if (!email || !password || !firstName || !lastName) {
                logger_1.Logger.warn('Missing required fields for sign up', 'AuthService');
                throw new common_1.BadRequestException('All fields are required');
            }
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                logger_1.Logger.warn(`User with email ${email} already exists`, 'AuthService');
                throw new common_1.ConflictException('User with this email already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await this.userRepository.create({
                email,
                firstName,
                lastName,
                password: hashedPassword,
            });
            logger_1.Logger.log(`User registered successfully: ${email}`, 'AuthService');
            return {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
        }
        catch (error) {
            logger_1.Logger.error('Error in signUp', error.stack, 'AuthService');
            throw error;
        }
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            logger_1.Logger.log(`Attempting login for user: ${email}`, 'AuthService');
            if (!email || !password) {
                logger_1.Logger.warn('Missing email or password for login', 'AuthService');
                throw new common_1.BadRequestException('Email and password are required');
            }
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                logger_1.Logger.warn(`User with email ${email} not found`, 'AuthService');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logger_1.Logger.warn(`Invalid password for user: ${email}`, 'AuthService');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const payload = {
                sub: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            logger_1.Logger.log(`User logged in successfully: ${email}`, 'AuthService');
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            };
        }
        catch (error) {
            logger_1.Logger.error('Error in login', error.stack, 'AuthService');
            throw error;
        }
    }
    async validateUser(userId) {
        try {
            logger_1.Logger.debug(`Validating user by id: ${userId}`, 'AuthService');
            const user = await this.userRepository.findById(userId);
            if (user) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        }
        catch (error) {
            logger_1.Logger.error('Error in validateUser', error.stack, 'AuthService');
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map