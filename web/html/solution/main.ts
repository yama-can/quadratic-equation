(window as any)["MathJax"] = {
	chtml: {
		matchFontHeight: false
	},
	tex: {
		inlineMath: [['$', '$']]
	},
	svg: {
		fontCache: 'global'
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const a = document.querySelector('div.inputs #a') as HTMLInputElement;
	const b = document.querySelector('div.inputs #b') as HTMLInputElement;
	const c = document.querySelector('div.inputs #c') as HTMLInputElement;
	const d = document.querySelector('div.inputs #d') as HTMLInputElement;

	document.addEventListener('keydown', (ev) => {
		if (document.querySelectorAll('.inputs input:focus').length != 0) {
			if (ev.key == "Enter") {
				(document.querySelector('button.solve') as HTMLButtonElement).click();
			}
		}
	});

	(document.querySelector('button.solve') as HTMLButtonElement).addEventListener('click', async () => {
		if (Number(d.value) == 0) {
			alert("実行中");
			const as = prime_factorization(Number(a.value));
			const cs = prime_factorization(Number(c.value));
			console.log(as, cs);
			for (let i = 0; i < (1 << as.length); i++) {
				for (let j = 0; j < (1 << cs.length); j++) {
					let ap = timeAll(bit(as.length, i).map((value) => as[value]));
					let cp = Number(a.value) / ap;
					let bp = timeAll(bit(cs.length, j).map((value) => cs[value]));
					let dp = Number(c.value) / bp;
					if (bp * cp + ap * dp == Number(b.value)) {
						console.log(ap, cp, bp, dp);
						// 変形先1
						// (ax + b)(cx + d) = acx^2 + (ad + bc)x + bd
						// a * c = A, b * d = C, bc + ad = B
						let to1 = `(${mathJaxStr.plus(`${delete1(ap)}x`, bp)})(${mathJaxStr.plus(`${delete1(cp)}x`, dp)})`;
						// 変形先2
						let to2 = `${mathJaxStr.plus(`${delete1(ap)}x`, bp)}, ${mathJaxStr.plus(`${delete1(cp)}x`, dp)}`;
						// 解
						let ans = `${mathJaxDivison(-bp, ap)},${mathJaxDivison(-dp, cp)}`;
						if (ap == cp && bp == dp) {
							to1 = `(${delete1(ap)}x+${bp})^2`;
							to2 = `${delete1(ap)}x+${bp}`;
							ans = `${mathJaxDivison(-bp, ap)}`;
						}
						document.querySelector('#ans')!!.innerHTML = `$${ans}$<br>
						この問題は二次方程式を
						$${to1}=0$
						の式に変形します。
						$${to2}$が$0$になるときが解なので、解は$${ans}$です。`
						document.querySelector('#ans')!!.classList.add('show');
						(window as any).MathJax.Hub.Typeset();
						return;
					}
				}
			}
		}
		{
			let as = Number(a.value);
			let bs = Number(b.value);
			let cs = Number(c.value);
			let ds = Number(d.value);
			document.querySelector('#ans')!!.innerHTML = `${ds == 0 ? "" : `$$ax^2+bx+c=d \\Rightarrow ax^2+bx+(c-d)=0$$`}
			解の公式を使用し、<br>
			$$x= \\frac {-b\\pm\\sqrt{b^{2}+4a${ds == 0 ? "c" : "(c-d)"}}}{2a}
			 = \\frac {${-bs}\\pm\\sqrt{${mathJaxStr.minus(bs * bs, 4)}\\times${as}\\times(${mathJaxStr.minus(cs, ds)})}}{2\\times${as}}
			 = \\frac {${-bs}\\pm${mathJaxStr.sqrt(bs * bs - 4 * as * (cs - ds))}}{${2 * as}}
			${(Math.sqrt(bs * bs - 4 * as * (cs - ds)) % 1 == 0 ?
					` = ${mathJaxStr.frac(-bs + Math.sqrt(bs * bs - 4 * as * (cs - ds)), 2 * as)}, ${mathJaxStr.frac(-bs - Math.sqrt(bs * bs - 4 * as * (cs - ds)), 2 * as)}` :
					"")}$$<br>
			と求められる。`
			console.log(mathJaxStr.sqrt(bs * bs - 4 * as * (cs - ds)));
			document.querySelector('#ans')!!.classList.add('show');
			(window as any).MathJax.Hub.Typeset();
		}
	})
})

function bit(n: number, b: number) {
	let vec = [];
	for (let i = 0; i < n; i++) {
		if (b & (1 << i)) {
			vec.push(i);
		}
	}
	return vec;
}

function timeAll(vec: number[]) {
	let time = 1;
	for (let i = 0; i < vec.length; i++) {
		time *= vec[i];
	}
	return time;
}

function isPrime(value: number) {
	for (let i = 2; i * i <= value; i++) {
		if (value % i == 0) return false;
	}
	return true;
}

function prime_factorization(value: number) {
	let vec: number[] = [];
	if (value < 0) {
		value = -value;
		vec.push(-1);
	}
	if (isPrime(value)) return [value];
	while (!isPrime(value)) {
		for (let i = 2; i < value; i++) {
			if (isPrime(i)) {
				while (value % i == 0) {
					value /= i;
					vec.push(i);
				}
			}
		}
	}
	return vec;
}

function delete1(num: number) {
	if (num == 1) return "";
	if (num == -1) return "-";
	return num;
}

function mathJaxDivison(a: number, b: number) {
	if (a % b == 0) {
		return a / b;
	}
	else {
		let minus = false;
		if (a < 0) {
			minus = !minus;
			a = -a;
		}
		if (b < 0) {
			minus = !minus;
			b = -b;
		}
		return `${(minus ? "-" : "")}\\frac {${a}}{${b}}`
	}
}

const mathJaxStr = {
	plus: (a: number | string, b: number | string) => {
		if (typeof a == "number") {
			a = a.toString();
		}
		if (typeof b == "number") {
			b = b.toString();
		}
		if (b.startsWith('-')) {
			return a + b;
		}
		return a + "+" + b;
	},
	minus: (a: number | string, b: number | string) => {
		return mathJaxStr.plus(a, -b);
	},
	plus_minus: (a: number, b: number) => {
		if (b % 1 == 0) {
			return `${a + b}, ${a - b}`
		}
		return `${a}\\pm${b}`;
	},
	frac: (a: number, b: number) => {
		if (a % b == 0) {
			return (a / b).toString();
		}
		return `\\frac {${a}}{${b}}`
	},
	sqrt: (a: number) => {
		const data = sqrtOut(a);
		const i = data[1] < 0;
		if (i) {
			data[1] = -data[1];
		}
		if (data[0] == 1) {
			return `${i ? "i" : ""}\\sqrt{${data[1]}}`;
		}
		return `${data[0]}${i ? "i" : ""}\\sqrt{${data[1]}}`;
	}
}

function sqrtOut(a: number): [number, number] {
	let map: { [key: number]: number } = {};
	prime_factorization(a).forEach((value) => {
		if (!map[value]) map[value] = 0;
		map[value]++;
	})
	// ルート外に出せる、出せない
	let c = 1, d = 1;
	for (const v in map) {
		const key = Number(v);
		if (map[key] % 2 == 1) {
			c *= Math.pow(key, (map[key] - 1) / 2);
			d *= key;
		}
		else {
			c *= Math.pow(key, map[key] / 2);
		}
	}
	return [c, d];
}
