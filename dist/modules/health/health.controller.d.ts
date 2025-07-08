export declare class HealthController {
    private readonly logger;
    constructor();
    getsSecureHealth(): Promise<{
        success: boolean;
        message: string;
    }>;
}
