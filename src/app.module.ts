import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppAlaa } from './app.alaa';
import { ConfigModule } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_Env !== 'production' ? ormConfig : ormConfigProd,
    }),
    EventsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppService,
    },
    {
      provide: 'Alaa Majed 🤍',
      useValue: 'I love Alaa 💕',
    },
    {
      provide: 'MESSAGE',
      inject: [AppAlaa],
      useFactory: (app) => `${app.Alaa()} Factory!`,
    },
    AppAlaa,
  ],
})
export class AppModule {}
