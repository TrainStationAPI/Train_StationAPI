import express from 'express';
import exphbs from 'express-handlebars';
import log from './log';
import config from './config/config.json';
import routeApi from './routes/api';
import routeWebApp from './routes/webapp';

const app = express();

function setStaticDirectory() {
  app.use(express.static('public'));
}

function setViewEngine() {
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');
}

setStaticDirectory();
setViewEngine();
routeApi(app);
routeWebApp(app);

const server = app.listen(config.port, () => {
  log.info(`TrainAPI HTTP server running on ${server.address().address}:${server.address().port}`);
});
