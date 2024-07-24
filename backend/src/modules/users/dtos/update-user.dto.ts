import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/userrole.entity';

export class UpdateUsersDto {
  @ApiProperty({
    example: 'info@gmail.com',
    description: 'The new email of the user',
  })
  email?: string;

  @ApiProperty({
    example: '000000000000000000',
    description: 'The Discord ID of the user',
  })
  user_id?: string;

  @ApiProperty({
    example: 'Name',
    description: 'The new name of the user',
  })
  name?: string;

  @ApiProperty({
    example: 'new password',
    description: 'The new password of the user',
  })
  password?: string;

  @ApiProperty({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    example: 'USER',
    description: 'The new role of the user',
  })
  role?: UserRole;
}
