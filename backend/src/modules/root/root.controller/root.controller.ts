import {
  Controller,
  Get,
  Logger,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/userrole.entity';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { Roles } from '../../auth/decodator/role.decodator';

@ApiTags('root')
@Controller()
export class RootController {
  constructor(private readonly logger: Logger) {}

  @Get()
  @ApiOperation({ summary: 'Hello World' })
  getHello(): string {
    return 'Hello World!';
  }

  @ApiBearerAuth()
  @Get('hellouser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'USER')
  @ApiOperation({ summary: 'Hello USER' })
  getModTest(@Request() req): string {
    this.logger.log(`[${req.user.email}] | user used hello User`);
    return 'Hello User!';
  }

  @ApiBearerAuth()
  @Get('helloadmin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'ADMIN')
  @SetMetadata('roles', [UserRole.ADMIN])
  @ApiOperation({ summary: 'Hello Admin' })
  getAdminTest(@Request() req): string {
    this.logger.log(`[${req.user.email}] | user used hello Admin`);
    return 'Hello Admin!';
  }
}
