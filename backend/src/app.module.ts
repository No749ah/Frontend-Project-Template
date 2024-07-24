import { RootModule } from './modules/root/root.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Users } from './modules/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: `mariadb`,
      host: `${process.env.DB_HOST}`,
      port: Number(`${process.env.DB_PORT}`),
      username: `${process.env.DB_USER}`,
      password: `${process.env.DB_PASSWORD}`,
      database: `${process.env.DB_DATABASE}`,
      synchronize: true,
      entities: [Users],
    }),
    RootModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
