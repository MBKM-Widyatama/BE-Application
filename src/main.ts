// NestJS imports
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Modules imports
import { AppModule } from './app.module';
import helmet from 'helmet';

// Interceptors imports
import { CustomBaseResponseInterceptor } from './libraries/common/interceptors';

// Third-party imports
import * as compression from 'compression';
import { setupFirebase } from './libraries/config/firebase/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const host: string = config.get<string>('APP_HOST');
  const port: string = config.get<string>('APP_PORT');
  const env: string = config.get<string>('APP_MODE');

  /**
   * Enable Helmet
   * Helmet helps you secure your Express apps by setting various HTTP headers.
   * https://github.com/helmetjs/helmet#how-it-works
   */
  if (env === 'production') {
    app.use(
      helmet({
        hsts: env === 'production',
        contentSecurityPolicy: env === 'production',
        crossOriginOpenerPolicy: env === 'production',
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );
  }

  /**
   * Enable Compression
   * Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app.
   * https://docs.nestjs.com/techniques/compression
   */
  app.use(compression());

  /**
   * Enable Cors
   * https://docs.nestjs.com/security/cors
   */
  app.enableCors();

  // ? --> Start API Configuration
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new CustomBaseResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * Set Firebase
   */
  setupFirebase(app, config);

  await app.listen(1337, () => {
    console.log(
      `[BACKEND SERVICE ${env}]`,
      `Server running at http://${host}:${port}`,
    );
  });
}
bootstrap();
