import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { AppIranService } from './appIran.service';
import { AppAlaa } from './app.alaa';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'nest-events',
      entities: [Event],
      synchronize: true,
    }),
    EventsModule,
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
