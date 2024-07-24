import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/userrole.entity';

export class RegisterDto {
  @ApiProperty({
    example: 'info@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: '0000000000000000',
    description: 'The Discord ID of the user',
  })
  user_id: string;

  @ApiProperty({
    example: 'Name',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user',
  })
  password: string;

  @ApiProperty({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  created_at: Date;

  updated_at: Date;
}
