import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PostModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      autoIndex: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Huen Blog" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 5003,
    //   },
    // }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          // username: config.get('REDIS_USERNAME'),
          password: config.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
