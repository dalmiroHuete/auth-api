import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../../commons/dtos/signup.dto';
import { LoginDto } from '../../commons/dtos/login.dto';
import { LoginResponse, SignUpResponse } from '../../commons/interfaces/auth.interface';
import { IUserRepository } from '../../repositories/user.repository.interface';
export declare class AuthService {
    private jwtService;
    private userRepository;
    constructor(jwtService: JwtService, userRepository: IUserRepository);
    signUp(signUpDto: SignUpDto): Promise<SignUpResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
    validateUser(userId: string): Promise<any>;
}
