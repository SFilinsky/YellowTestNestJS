import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Workout } from '../entities/workout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { CrudRequest } from '@nestjsx/crud';

@Injectable()
export class WorkoutService extends TypeOrmCrudService<Workout> {
  constructor(@InjectRepository(Workout) protected repo: Repository<Workout>) {
    super(repo);
  }

  getReport(req: CrudRequest, start: Date, end: Date): Promise<any> {
    return this.createBuilder(req.parsed, req.options).then((builder) => {
      return builder
        .select(
          `Concat('Week ', 
          Floor(DateDiff(date, '${moment(start, 'YYYY-MM-DD').format(
            'YYYY-MM-DD',
          )}') / 7),
          ': (',
          Date(Date_Add(date, interval -WEEKDAY(date)-1 day)),
          '/',
          Date(Date_Add(date_add(date, interval  -WEEKDAY(date)-1 day), interval 6 day)),
          ')'
          )`,
          'weekName',
        )
        .addSelect('Sum(distance)', 'totalDistance')
        .addSelect('SUM(DISTANCE) / SUM(TIME)', 'averageSpeed')
        .addSelect('AVG(TIME)', 'averageTime')
        .where(`(Date(date) BETWEEN :start AND :end)`, {
          start: start,
          end: end,
        })
        .addGroupBy('weekName')
        .execute();
    });
  }
}
