import {Controller, Get, Logger, UseGuards} from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor() {}


  @Get('healthy')
  async getsSecureHealth() {
    this.logger.log(`Calling GET endpoint to validate health`);

    return {
      success: true,
      message: 'Successfully GET health call',
    };
  }
}
