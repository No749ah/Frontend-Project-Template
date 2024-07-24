import { ApiProperty } from '@nestjs/swagger';

export class ChangeCredentialsDto {
  @ApiProperty({
    example: 'currentPassword',
    description: 'The current password of the user',
    required: true,
  })
  oldPassword: string;

  @ApiProperty({
    example: 'Name',
    description: 'The name of the user',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'newpassword',
    description: 'The new password of the user',
    required: false,
  })
  newPassword?: string;
}
