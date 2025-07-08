export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
}
export declare class SignUpResponseDto {
    message: string;
    user: UserResponseDto;
}
