import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGO_URI');
        logger.log(`Connecting to MongoDB at ${uri}`);
        return { uri };
      },
      inject: [ConfigService],
    }),

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
