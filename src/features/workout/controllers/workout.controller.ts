import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WorkoutService } from '../services/workout.service';
import {
  Crud,
  CrudAuth,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { Workout } from '../entities/workout.entity';
import { JwtAuthGuard } from '../../../core/auth/guards/jwt-auth.guard';
import { Transform } from 'class-transformer';
import { SafeUser } from '../../../core/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

class ReportDto {
  @ApiProperty()
  @Transform((value) => new Date(value))
  // @IsDate()
  start!: Date;

  @ApiProperty()
  @Transform((value) => new Date(value))
  // @IsDate()
  end!: Date;

  userId!: string;
}

@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Workout,
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: SafeUser) => ({
    userId: {
      $eq: user.id,
    },
  }),
  persist: (user: SafeUser) => ({
    userId: user.id,
  }),
})
@Controller('workout')
export class WorkoutController implements CrudController<Workout> {
  constructor(public readonly service: WorkoutService) {}

  @UseInterceptors(CrudRequestInterceptor)
  @Post('report')
  async report(
    @ParsedRequest() crudRequest: CrudRequest,
    @Body() reportDto: ReportDto,
  ) {
    return this.service.getReport(crudRequest, reportDto.start, reportDto.end);
  }
}
