import knex from '../database/connection'
import {Request, Response, response} from 'express'
import convert_hour_minutes from '../utils/convert_hour_minutes';
import connection from '../database/connection';

interface ScheduleItem{
  week_day:number;
  begin_class: string;
  final_class: string
}

class c_Classes {

    async index (request: Request, response:Response){
      
      const filters = request.query;

      if( !filters.week_day || !filters.subject || !filters.time){
        return response.status(400).json({
          error: "Misssing filters to seach classes"
        });
      }

      const timeInminutes = convert_hour_minutes(filters.time as string);

      console.log(timeInminutes);

      const classes = await connection('classes')
      .whereExists(function (){
        this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', (Number(filters.week_day)))
        .whereRaw('`class_schedule`.`begin_class` <= ??', [timeInminutes])
        .whereRaw('`class_schedule`.`final_class` > ??', [timeInminutes]);
      
      })
      .where('classes.subject', '=', filters.subject as string)
      .join('users', 'classes.user_id', '=', 'users.id')
      .select(['classes.*', 'users.*']);

      return response.json(classes);
    };


    async create (request:Request, response:Response) {
      const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
      } = request.body;

      const trx = await knex.transaction();

      try{  
      
     const insert_users_id = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio
      });

      const user_id = insert_users_id[0];

      const insert_classe_id = await trx('classes').insert({
        subject,
        cost,
        user_id
      });

      const class_id = insert_classe_id [0];

      const classSchendule = schedule.map((scheduleItem:ScheduleItem )=> {
        return ({
          class_id,
          week_day: scheduleItem.week_day,
          begin_class: convert_hour_minutes(scheduleItem.begin_class),
          final_class: convert_hour_minutes(scheduleItem.final_class)
        });
      });

      await trx ('class_schedule').insert(classSchendule);

      await trx.commit();

      return response.status(201).send();
      }catch(err){
        await trx.rollback();
        return response.status(400).json({
          error: "Unexpectd error while creating new classe."
        });
      }
    }
  } 

  export default c_Classes;