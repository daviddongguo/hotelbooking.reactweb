const config = {
	dev: {
		server: 'https://localhost:5001',
	},
	prod: {
		server:
			process.env.SERVER_URL ||
			'https://davidwuhotelbooking.azurewebsites.net/',
	},
};
export default process.env.NODE_ENV === 'production' ? config.prod : config.dev;
