import child_process from "child_process";
import Path from "path";
import http from "http"
import fs from "fs";
import mime from "mime";
import chokidar from "chokidar";

child_process.exec(`node ${Path.join(process.argv[1], '../')}`);

chokidar.watch('./html').on('all', () => {
	child_process.exec(`node ${Path.join(process.argv[1], '../')}`);
	console.log("Folder changed");
})

http.createServer((req, res) => {
	console.log("Request recieved");
	const url = (req.url as string).split('/').filter(Boolean).join('/');
	const fileStat = fs.statSync(Path.join('./public', url), { throwIfNoEntry: false });
	if (fileStat == undefined) {
		res.statusCode = 404;
		res.end("404");
		return;
	}
	if (fileStat.isFile()) {
		const type = mime.getType(url);
		if (type) {
			res.setHeader('Content-Type', type);
		}
		res.end(fs.readFileSync(Path.join('./public', url)));
	} else if (fileStat.isDirectory()) {
		if (fs.statSync(Path.join('./public', url, 'index.html'))) {
			res.setHeader('Content-Type', 'text/html');
			res.end(fs.readFileSync(Path.join('./public', url, 'index.html')));
		} else {
			res.statusCode = 404;
			res.end("404");
		}
	}
}).listen(80, '0.0.0.0');

console.log("The server is listening on http://localhost");