import express, { request, response } from 'express';

import c_Classes from '../src/controllers/classes_controller';
import ConnectionsControllers from './controllers/connections_controller';


const routes = express.Router();

const c_classes = new c_Classes();
const cc = new ConnectionsControllers();


routes.get('/classes', c_classes.index);
routes.post('/classes', c_classes.create);

routes.post('/connectionsTeacher', cc.create);
routes.get('/connectionsTeacher', cc.index);


export default routes;