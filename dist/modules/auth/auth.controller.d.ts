import { AuthService } from './auth.service';
import { SignUpDto } from '../../commons/dtos/signup.dto';
import { LoginDto } from '../../commons/dtos/login.dto';
import { LoginResponse, SignUpResponse } from '../../commons/interfaces/auth.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<SignUpResponse>;
    login(loginDto: LoginDto): Promise<LoginResponse>;
}
