import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutModule } from './features/workout/workout.module';
import { ImageModule } from './features/image/image.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'yellow_test',
      autoLoadEntities: true,
      synchronize: true,
      logging: ['query', 'error', 'warn', 'info'],
      logger: 'advanced-console',
    }),
    MulterModule.register({
      dest: './upload',
    }),
    AuthModule,
    WorkoutModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
