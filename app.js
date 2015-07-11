var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	RateLimit = require('express-rate-limit'),
	http = require('http'),
	debug = require('debug')('twssapi:server');

var routes = require('./routes/index');

var limiter = RateLimit(
	{	'windowMs' : 60 * 1000,
		'delayMs' : 20,
		'max' : 30,
		'global' : true
	}
);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

app.use('/', routes);

app.use(
	function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	}
);

// if(app.get('env') === 'development') {
// 	app.use(
// 		function(err, req, res, next) {
// 			res.status(err.status || 500);
// 			res.render(
// 				'error',
// 				{	message: err.message,
// 					error: err
// 				}
// 			);
// 		}
// 	);
// }

app.use(
	function(err, req, res, next) {
		res.status(err.status || 500);
		res.render(
			'error',
			{	message: err.message,
				error: {}
			}
		);
	}
);

function onError(error) {
	if(error.syscall !== 'listen')
		throw error;

	var bind = typeof port === 'string'	? ('Pipe ' + port) : ('Port ' + port);

	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'	? ('pipe ' + addr) : ('port ' + addr.port);
	debug('Listening on ' + bind);
}

var server = http.createServer(app);
server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);