var daemon = require("daemonize2").setup(
	{   main: "app.js",
		name: "twss-web-api",
		pidfile: "twss-web-api.pid"
	}
);

switch(process.argv[2]) {

	case "start":
		daemon.start();
		break;

	case "stop":
		daemon.stop();
		break;

	default:
		console.log("Usage: [start|stop]");
}