import fs from "fs";
import ejs from "ejs";
import Path from "path";

const files = fs.readdirSync('./html', { recursive: true });
const template = fs.readFileSync('./template.ejs', 'utf-8');

let ends = 0;
files.forEach(async (path) => {
	if (typeof path != "string") {
		console.error(`ERR! Path ${path} is buffer!!`);
		process.exit(1);
	}
	const stat = fs.statSync(Path.join('./html', path));
	if (stat.isFile()) {
		fs.mkdirSync(Path.join('./public', path, '../'), { recursive: true });

		if (path.endsWith('.html')) {
			let body = fs.readFileSync(Path.join('./html', path), 'utf-8');
			let title = body.match(/<title>(.*)<\/title>/)?.at(1);
			if (!title) title = "2次方程式ツール";
			Object.freeze(title);
			body = body.replace(/<title>(.*)<\/title>/g, "");
			Object.freeze(body);

			fs.writeFileSync(Path.join('./public', path), await ejs.render(template, { body, title }, { async: true }), { encoding: 'utf-8' });
		} else {
			fs.copyFileSync(Path.join('./html', path), Path.join('./public', path));
		}
	}
	ends++;
	if (ends == files.length) {
		process.exit(0);
	}
})