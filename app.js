const express = require('express');
const config = require('config');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

console.log(process.env.NODE_ENV);
app.use('/api', createProxyMiddleware({ 
	target: 'http://localhost:8189', changeOrigin: true 
}));
if (process.env.NODE_ENV === 'production'){
	app.use('/', express.static(path.join(__dirname, 'frontend', 'build')));
	app.get("*", (req, res) => {
		console.log(req);
		res.sendFile(path.resolve(__dirname, 'frontend','build','index.html'));
	})
}
const PORT = config.get('port') || 5000

app.listen(PORT, () => console.log(`App has been started  on port ${PORT}...`));