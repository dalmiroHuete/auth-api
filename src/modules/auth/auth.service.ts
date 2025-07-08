import { Injectable, UnauthorizedException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../../commons/dtos/signup.dto';
import { LoginDto } from '../../commons/dtos/login.dto';
import { LoginResponse, SignUpResponse } from '../../commons/interfaces/auth.interface';
import { IUserRepository, USER_REPOSITORY } from '../../repositories/user-repository.interface';
import { Logger } from '../../infrastructure/logger';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    try {
      const { email, password, firstName, lastName } = signUpDto;

      Logger.log(`Attempting to register user: ${email}`, 'AuthService');

      if (!email || !password || !firstName || !lastName) {
        Logger.warn('Missing required fields for sign up', 'AuthService');
        throw new BadRequestException('All fields are required');
      }

      const existingUser = await this.userRepository.findByEmail(email);

      if (existingUser) {
        Logger.warn(`User with email ${email} already exists`, 'AuthService');
        throw new ConflictException('User with this email already exists');
      }

      // encrypt the password
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await this.userRepository.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      Logger.log(`User registered successfully: ${email}`, 'AuthService');

      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      Logger.error('Error in signUp', error.stack, 'AuthService');
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const { email, password } = loginDto;

      Logger.log(`Attempting login for user: ${email}`, 'AuthService');

      if (!email || !password) {
        Logger.warn('Missing email or password for login', 'AuthService');
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        Logger.warn(`User with email ${email} not found`, 'AuthService');
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        Logger.warn(`Invalid password for user: ${email}`, 'AuthService');
        throw new UnauthorizedException('Invalid credentials');
      }

      // generate token
      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      Logger.log(`User logged in successfully: ${email}`, 'AuthService');

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      Logger.error('Error in login', error.stack, 'AuthService');
      throw error;
    }
  }

  async validateUser(userId: string): Promise<any> {
    try {
      Logger.debug(`Validating user by id: ${userId}`, 'AuthService');
      const user = await this.userRepository.findById(userId);

      if (user) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      Logger.error('Error in validateUser', error.stack, 'AuthService');
      throw error;
    }
  }
}
