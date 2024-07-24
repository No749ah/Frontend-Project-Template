import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { jwtConstants } from './constants/constants';
import { LoggerMiddleware } from '../../midleware/logger.middleware';
import { Logger } from '@nestjs/common/services/logger.service';
import { RateLimitMiddleware } from '../../midleware/rate-limit.middleware';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: undefined},
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, Logger],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);

    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'auth/login', method: 1 });
  }
}
