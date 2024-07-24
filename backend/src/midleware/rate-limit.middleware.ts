import {
  HttpException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';

const rateLimitStore = new Map<string, { count: number; time: number }>();

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {}

  use(req: any, next: () => void): void {
    const ip = req.ip;
    const currentTime = new Date().getTime();

    const existingRecord = rateLimitStore.get(ip);

    if (existingRecord) {
      if (existingRecord.count >= 10) {
        if (currentTime - existingRecord.time <= 60 * 1000) {
          this.logger.log(
            `[${ip}] Brute-Force Prevention: User was blocked for 1 Minute (to many tries to log in)`,
          );
          throw new HttpException('Too many requests', 429);
        }
        rateLimitStore.set(ip, { count: 1, time: currentTime });
      } else {
        rateLimitStore.set(ip, {
          count: existingRecord.count + 1,
          time: existingRecord.time,
        });
      }
    } else {
      rateLimitStore.set(ip, { count: 1, time: currentTime });
    }
    next();
  }
}
