import knex from '../database/connection'
import {Request, Response, response, request} from 'express'

import connection from '../database/connection';


export default class ConnectionsControllers{

  async index (request: Request, response:Response){

    const totalconnections = await connection('connections_teacher')
    .count('* as total');

    const {total} = totalconnections[0];

    return response.status(200).json({total});

  }
  
  async create (request: Request, response:Response){
    
    const {user_id} = request.body;

    await connection('connections_teacher').insert({
      user_id,
    });

    return response.status(201).send()
  
  }


}



