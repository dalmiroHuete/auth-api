import { User } from '../commons/interfaces/user.interface';
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
    }): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<User>;
}
export declare const USER_REPOSITORY = "USER_REPOSITORY";
