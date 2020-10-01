const express = require('express');
const config = require('config');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

if (process.env.NODE_ENV === 'production'){
	const JAVA_APP_PORT = config.get('java_app_port');
	app.use('/api', createProxyMiddleware({ 
		target: `http://localhost:${JAVA_APP_PORT}`, changeOrigin: true 
	}));	
	app.use('/', express.static(path.join(__dirname, 'frontend', 'build')));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, 'frontend','build','index.html'));
	})
}
const PORT = config.get('port') || 5000

app.listen(PORT, () => console.log(`App has been started  on port ${PORT}...`));