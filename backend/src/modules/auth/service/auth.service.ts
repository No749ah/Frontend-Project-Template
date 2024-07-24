import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { RegisterDto } from '../../users/dtos/register.dto';
import { ChangeCredentialsDto } from '../../users/dtos/change-credentials.dto';
import { DeleteDto } from '../../users/dtos/delete.dto';
import { UpdateUsersDto } from '../../users/dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: Logger,
  ) {}

  async getUsers(requestEmail: string) {
    this.logger.log(`[${requestEmail}] | user requested all users`);
    return this.usersService.findAll();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcryptjs.compare(pass, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const user_cred = await this.usersService.findOneByEmail(user.email);

    if (!user_cred) {
      this.logger.error(
        `[STRANGER] | user tried to login with email ${user.email} (User not found)`,
      );
      throw new UnauthorizedException('User not found.');
    }

    const payload = {
      email: user_cred.email,
      name: user_cred.name,
      role: user_cred.role,
    };

    this.logger.log(`[${user_cred.email}] | user successfully logged in`);

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '900s' }),
    };
  }

  async register(requestEmail: string, data: RegisterDto) {
    if (!data) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user (Data not provided)`,
      );
      throw new BadRequestException('Data not provided');
    }

    if (
      !data.email ||
      typeof data.email !== 'string' ||
      !data.email.includes('@') ||
      data.email.length > 255
    ) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user (Invalid or missing email)`,
      );
      throw new BadRequestException('Invalid or missing email');
    }

    if (
      !data.password ||
      typeof data.password !== 'string' ||
      data.password.length < 8 ||
      data.password.length > 255
    ) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user [${data.email}] (Invalid or missing password)`,
      );
      throw new BadRequestException('Invalid or missing password');
    }

    if (!data.name || typeof data.name !== 'string' || data.name.length > 255) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user [${data.email}] (Invalid or missing name)`,
      );
      throw new BadRequestException('Invalid or missing name');
    }

    if (
      !data.user_id ||
      typeof data.user_id !== 'string' ||
      data.user_id.length > 255
    ) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user [${data.user_id}] (Invalid or missing name)`,
      );
      throw new BadRequestException('Invalid or missing name');
    }

    if (!data.role || !['DEV', 'ADMIN', 'MOD', 'BOT'].includes(data.role)) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user [${data.email}] (Invalid or missing role)`,
      );
      throw new BadRequestException('Invalid or missing role');
    }

    const existingUser = await this.usersService.findOneByEmail(data.email);
    if (existingUser) {
      this.logger.log(
        `[${requestEmail}] | user tried to register a user [${data.email}] (User with this email already exists)`,
      );
      throw new ConflictException('User with this email already exists');
    }

    data.created_at = new Date();
    data.password = await bcryptjs.hash(data.password, 10);

    const response = await this.usersService.create(data);

    if (!response) {
      this.logger.error(
        `[${requestEmail}] | user tried to register a user [${data.email}] (Failed to create user)`,
      );
      throw new InternalServerErrorException('Failed to create user');
    } else {
      this.logger.log(
        `[${requestEmail}] | user successfully register new a user [${data.email} | ${data.name} | ${data.role}]`,
      );
      return { message: 'User registered successfully', statusCode: 201 };
    }
  }

  async changeCredentials(email: string, data: ChangeCredentialsDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (!data.oldPassword) {
      this.logger.log(
        `[${email}] | user tried to register a user (Current password not provided)`,
      );
      throw new BadRequestException('Current password not provided');
    }

    // Überprüfe das aktuelle Passwort
    if (!(await bcryptjs.compare(data.oldPassword, user.password))) {
      this.logger.log(
        `[${email}] | user tried to register a user (Wrong oldPassword provided)`,
      );
      throw new UnauthorizedException('Wrong oldPassword provided');
    }

    if (data.name) user.name = data.name;
    if (data.newPassword) {
      user.password = await bcryptjs.hash(data.newPassword, 10);
    }

    user.updated_at = new Date();

    const response = await this.usersService.update(user);
    if (!response) {
      this.logger.error(
        `[${email}] | user tried to register a user (Failed to change credentials)`,
      );
      throw new InternalServerErrorException('Failed to change credentials!');
    } else {
      this.logger.log(`[${email}] | changed credentials successfully`);
      return { message: 'Credentials changed successfully', statusCode: 200 };
    }
  }

  async deleteUserByEmail(requestEmail: string, data: DeleteDto) {
    if (!data) {
      this.logger.log(
        `[${requestEmail}] | user tried to delete a user (No data provided)`,
      );
      throw new BadRequestException('No data provided');
    }
    if (!data.email) {
      this.logger.log(
        `[${requestEmail}] | user tried to delete a user (No email provided)`,
      );
      throw new BadRequestException('No email provided');
    }

    const user = await this.usersService.findOneByEmail(data.email);
    if (!user) {
      this.logger.log(
        `[${requestEmail}] | user tried to delete a user [${data.email}] (User not found)`,
      );
      throw new BadRequestException('User not found');
    }

    const response = await this.usersService.deleteByEmail(data.email);
    if (!response) {
      this.logger.error(
        `[${requestEmail}] | user tried to delete a user [${data.email}] (Failed to delete user!)`,
      );
      throw new InternalServerErrorException('Failed to delete user!');
    } else {
      this.logger.log(
        `[${requestEmail}] | successfully deleted user [${data.email}]`,
      );

      return { message: 'User was deleted successfully', statusCode: 200 };
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  async updateByEmail(requestEmail: string, data: UpdateUsersDto) {
    if (!data.email) {
      this.logger.log(
        `[${requestEmail}] | user tried to edit a user (email not provided)`,
      );
      throw new BadRequestException('email not provided');
    }
    const user = await this.usersService.findOneByEmail(data.email);
    if (!user) {
      this.logger.error(
        `[${requestEmail}] | user tried to edit a user [${data.email}] (User not found)`,
      );
      throw new NotFoundException('User not found');
    }

    if (data.password) user.password = await bcryptjs.hash(data.password, 10);
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.role !== undefined) user.role = data.role;

    const isUpdated = await this.usersService.updateByEmail(data.email, user);

    if (!isUpdated) {
      this.logger.error(
        `[${requestEmail}] | user tried to edit a user [${data.email}] (Failed to update user details)`,
      );
      throw new InternalServerErrorException('Failed to update user details');
    } else {
      this.logger.log(
        `[${requestEmail}] | user edited [${data.email}] (User details updated successfully)`,
      );
      return { message: 'User details updated successfully', statusCode: 200 };
    }
  }
}
