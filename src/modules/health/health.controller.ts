import {Controller, Get, Logger, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from "../../commons/guards/jwt-auth.guard";

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor() {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getsSecureHealth() {
    this.logger.log(`Calling GET endpoint to validate secure health`);

    return {
      success: true,
      message: 'Successfully GET health secure call',
    };
  }
}
