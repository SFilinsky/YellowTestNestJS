import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutModule } from './features/workout/workout.module';
import { ImageModule } from './features/image/image.module';
import { MulterModule } from '@nestjs/platform-express';

const typeOrmConfig = process.env.DATABASE_URL
  ? {
      url: process.env.DATABASE_URL,
      type: 'postgres',
      synchronize: false,
      logging: false,
      extra: {
        ssl: true,
      },
      autoLoadEntities: true,
    }
  : {
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
    };

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    TypeOrmModule.forRoot(typeOrmConfig),
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
