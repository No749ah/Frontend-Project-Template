import { ApiProperty } from '@nestjs/swagger';

export class DeleteDto {
  @ApiProperty({
    example: 'info@gmail.com',
    description: 'The email of the user which should be deleted',
  })
  email: string;
}
