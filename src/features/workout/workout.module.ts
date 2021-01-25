import { Module } from '@nestjs/common';
import { WorkoutService } from './services/workout.service';
import { WorkoutController } from './controllers/workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './entities/workout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout])],
  exports: [],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
