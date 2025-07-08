import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';

import { AuthDto, SignUpResponseDto } from '../dtos/auth.dto';

export function ApiSignUpDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiBody({ type: SignUpDto }),
    ApiResponse({ status: 201, description: 'User registered successfully', type: SignUpResponseDto }),
    ApiResponse({ status: 409, description: 'User with this email already exists' }),
    ApiResponse({ status: 400, description: 'Validation error' }),
  );
}

export function ApiLoginDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate user and get JWT token' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({ status: 200, description: 'User authenticated successfully', type: AuthDto }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
    ApiResponse({ status: 400, description: 'Validation error' }),
  );
}
