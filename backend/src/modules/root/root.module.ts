import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RootController } from './root.controller/root.controller';
import { LoggerMiddleware } from '../../midleware/logger.middleware';

@Module({
  controllers: [RootController],
  providers: [Logger],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(RootController);
  }
}
