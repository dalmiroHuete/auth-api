# Repository Pattern Implementation

## Overview

This application implements the Repository pattern to provide a clean separation between business logic and data access logic. This pattern helps in making the code more testable, maintainable, and flexible.

## Architecture

### Repository Interface

The `IUserRepository` interface defines the contract for all user-related data operations:

```typescript
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: {
    email: string;
    fullName: string;
    password: string;
  }): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
}
```

### Concrete Implementations

#### PrismaUserRepository

The main implementation using Prisma ORM:

```typescript
@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ... other methods
}
```

#### MockUserRepository

A mock implementation for testing:

```typescript
@Injectable()
export class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  // ... other methods
}
```

## Dependency Injection

The repository is injected using a token to maintain loose coupling:

```typescript
// In auth.module.ts
providers: [
  {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
  },
]

// In auth.service.ts
constructor(
  @Inject(USER_REPOSITORY)
  private userRepository: IUserRepository,
) {}
```

## Benefits

### 1. Separation of Concerns

- **Business Logic**: Handled in services
- **Data Access**: Handled in repositories
- **Infrastructure**: Handled in concrete implementations

### 2. Testability

- Easy to mock repositories for unit testing
- No need to set up real database connections in tests
- Faster test execution

### 3. Flexibility

- Can easily switch between different data sources
- Can implement caching strategies
- Can add logging or monitoring without changing business logic

### 4. Maintainability

- Clear interfaces make code easier to understand
- Changes to data access don't affect business logic
- Easier to add new features

## Usage Examples

### In Services

```typescript
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepository: IUserRepository,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(signUpDto.email);
    
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Create user
    const user = await this.userRepository.create({
      email: signUpDto.email,
      fullName: signUpDto.fullName,
      password: hashedPassword,
    });

    return { message: 'User created', user };
  }
}
```

### In Tests

```typescript
describe('AuthService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useClass: MockUserRepository, // Use mock for testing
        },
      ],
    }).compile();
  });
});
```

## Best Practices

### 1. Interface Segregation

Keep repository interfaces focused on specific entities:

```typescript
// Good: Focused interface
export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

// Avoid: Generic repository with too many methods
export interface IGenericRepository<T> {
  findOne(id: string): Promise<T>;
  findMany(): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
  // ... many more methods
}
```

### 2. Method Naming

Use descriptive method names that clearly indicate their purpose:

```typescript
// Good
findByEmail(email: string): Promise<User | null>;
findByEmailAndActive(email: string, active: boolean): Promise<User | null>;

// Avoid
find(email: string): Promise<User | null>;
get(email: string, active?: boolean): Promise<User | null>;
```

### 3. Error Handling

Let the repository throw domain-specific exceptions:

```typescript
async findById(id: string): Promise<User> {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });
  
  if (!user) {
    throw new UserNotFoundException(`User with id ${id} not found`);
  }
  
  return user;
}
```

### 4. Transaction Support

For operations that require transactions:

```typescript
async createWithProfile(userData: CreateUserData, profileData: CreateProfileData): Promise<User> {
  return this.prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: userData,
    });
    
    await prisma.profile.create({
      data: { ...profileData, userId: user.id },
    });
    
    return user;
  });
}
```

## Future Enhancements

### 1. Caching Repository

```typescript
@Injectable()
export class CachedUserRepository implements IUserRepository {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: CacheService,
  ) {}

  async findById(id: string): Promise<User | null> {
    const cached = await this.cacheService.get(`user:${id}`);
    if (cached) return cached;

    const user = await this.userRepository.findById(id);
    if (user) {
      await this.cacheService.set(`user:${id}`, user, 3600);
    }
    return user;
  }
}
```

### 2. Event-Driven Repository

```typescript
@Injectable()
export class EventDrivenUserRepository implements IUserRepository {
  constructor(
    private userRepository: IUserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const user = await this.userRepository.create(data);
    
    this.eventEmitter.emit('user.created', user);
    
    return user;
  }
}
```

### 3. Repository Factory

```typescript
@Injectable()
export class UserRepositoryFactory {
  constructor(
    private prismaUserRepository: PrismaUserRepository,
    private cachedUserRepository: CachedUserRepository,
  ) {}

  create(type: 'prisma' | 'cached'): IUserRepository {
    switch (type) {
      case 'prisma':
        return this.prismaUserRepository;
      case 'cached':
        return this.cachedUserRepository;
      default:
        throw new Error(`Unknown repository type: ${type}`);
    }
  }
}
```

## Conclusion

The Repository pattern provides a clean and maintainable way to handle data access in this application. It promotes good software engineering practices and makes the codebase more robust and testable. 