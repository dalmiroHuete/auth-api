import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../repositories/user-repository.interface';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: typeof mockUserRepository;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(USER_REPOSITORY);
    jwtService = module.get(JwtService);

    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should throw BadRequestException when required fields are missing', async () => {
      await expect(service.signUp({ email: '', password: '', firstName: '', lastName: '' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException when user already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@mail.com' });
      await expect(service.signUp({ email: 'test@mail.com', password: 'pass', firstName: 'A', lastName: 'B' }))
        .rejects.toThrow(ConflictException);
    });

    it('should create user and return response when data is valid', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({ id: '1', email: 'test@mail.com', firstName: 'A', lastName: 'B' });
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedpass');
      const result = await service.signUp({ email: 'test@mail.com', password: 'pass', firstName: 'A', lastName: 'B' });
      expect(result.user.email).toBe('test@mail.com');
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashedpass' }));
    });
  });

  describe('login', () => {
    it('should throw BadRequestException when email or password is missing', async () => {
      await expect(service.login({ email: '', password: '' })).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'notfound@mail.com', password: 'pass' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@mail.com', password: 'hashed' });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'test@mail.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token and user when credentials are valid', async () => {
      userRepository.findByEmail.mockResolvedValue({ id: '1', email: 'test@mail.com', password: 'hashed', firstName: 'A', lastName: 'B' });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token');
      const result = await service.login({ email: 'test@mail.com', password: 'pass' });
      expect(result.access_token).toBe('token');
      expect(result.user.email).toBe('test@mail.com');
    });
  });

  describe('validateUser', () => {
    it('should return user data without password when user exists', async () => {
      userRepository.findById.mockResolvedValue({ id: '1', email: 'test@mail.com', password: 'hashed', firstName: 'A', lastName: 'B' });
      const result = await service.validateUser('1');
      expect(result).toEqual({ id: '1', email: 'test@mail.com', firstName: 'A', lastName: 'B' });
    });

    it('should return null when user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null);
      const result = await service.validateUser('2');
      expect(result).toBeNull();
    });
  });
}); 