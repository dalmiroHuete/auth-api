import { PrismaService } from '../infrastructure/prisma.service';
import { User } from '../commons/interfaces/user.interface';
import { IUserRepository } from '../repositories/user.repository.interface';
export declare class UserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
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
