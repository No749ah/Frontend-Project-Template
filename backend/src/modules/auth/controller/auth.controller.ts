import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../../users/dtos/register.dto';
import { LoginDto } from '../../users/dtos/login.dto';
import { ChangeCredentialsDto } from '../../users/dtos/change-credentials.dto';
import { RolesGuard } from '../guard/roles.guard';
import { UserRole } from '../../users/entities/userrole.entity';
import { Roles } from '../decodator/role.decodator';
import { DeleteDto } from '../../users/dtos/delete.dto';
import { UpdateUsersDto } from '../../users/dtos/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private logger: Logger) {}

  @ApiTags('auth')
  @ApiOperation({ summary: 'Login to the application' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personal user-profile' })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  getProfile(@Request() req) {
    this.logger.log(`[${req.user.email}] | user fetched the personal profile`);
    return req.user;
  }

  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user credentials' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Put('user')
  async changeCredentials(
    @Request() req,
    @Body() changeData: ChangeCredentialsDto,
  ) {
    return this.authService.changeCredentials(req.user.email, changeData);
  }

  @ApiTags('auth-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'ADMIN')
  @Get('admin/users')
  async getUsers(@Request() req) {
    return await this.authService.getUsers(req.user.email);
  }

  @ApiTags('auth-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'ADMIN')
  @HttpCode(201)
  @Post('admin/user')
  async register(@Request() req, @Body() registerData: RegisterDto) {
    return this.authService.register(req.user.email, registerData);
  }

  @ApiTags('auth-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user details by email' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'ADMIN')
  @Put('admin/user')
  async updateUser(@Request() req, @Body() updateData: UpdateUsersDto) {
    return this.authService.updateByEmail(req.user.email, updateData);
  }

  @ApiTags('auth-admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by email' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(<UserRole>'ADMIN')
  @HttpCode(200)
  @Delete('admin/user')
  async deleteUserByEmail(@Request() req, @Body() data: DeleteDto) {
    return await this.authService.deleteUserByEmail(req.user.email, data);
  }
}
