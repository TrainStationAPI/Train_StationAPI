import express from 'express';
import log from './log';
import config from './config/config.json';
import routeApi from './routes/api';

const app = express();

routeApi(app);

const server = app.listen(config.port, () => {
  log.info(`TrainAPI HTTP server running on ${server.address().address}:${server.address().port}`);
});
