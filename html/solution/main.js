window.MathJax = {
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
	const a = document.querySelector('div.inputs #a');
	const b = document.querySelector('div.inputs #b');
	const c = document.querySelector('div.inputs #c');
	const d = document.querySelector('div.inputs #d');

	document.addEventListener('keydown', (ev) => {
		if (document.querySelectorAll('.inputs input:focus').length != 0) {
			if (ev.key == "Enter") {
				document.querySelector('button.solve').click();
			}
		}
	})

	document.querySelector('button.solve').addEventListener('click', async () => {
		if (d.value == 0) {
			alert("実行中");
			const as = prime_factorization(Number(a.value));
			const cs = prime_factorization(Number(c.value));
			console.log(as, cs);
			for (let i = 0; i < (1 << as.length); i++) {
				for (let j = 0; j < (1 << cs.length); j++) {
					let ap = timeAll(bit(as.length, i).map((value) => as[value]));
					let cp = a.value / ap;
					let bp = timeAll(bit(cs.length, j).map((value) => cs[value]));
					let dp = c.value / bp;
					if (bp * cp + ap * dp == b.value) {
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
						document.querySelector('#ans').innerHTML = `$${ans}$<br>
						この問題は二次方程式を
						$${to1}=0$
						の式に変形します。
						$${to2}$が$0$になるときが解なので、解は$${ans}$です。`
						document.querySelector('#ans').classList.add('show');
						MathJax.Hub.Typeset();
						return;
					}
				}
			}
		}
		let as = a.value;
		let bs = b.value;
		let cs = c.value;
		document.querySelector('#ans').innerHTML = `この問題の解は解の公式を使用し、
		$$x=\\frac {${-bs}\\pm\\sqrt{${mathJaxStr.minus(bs * bs, 4 * as * cs)}}}{${2 * as}}$$と求められる。`
		document.querySelector('#ans').classList.add('show');
		MathJax.Hub.Typeset();
	})
})

function bit(n, b) {
	let vec = [];
	for (let i = 0; i < n; i++) {
		if (b & (1 << i)) {
			vec.push(i);
		}
	}
	return vec;
}

function timeAll(vec) {
	let time = 1;
	for (let i = 0; i < vec.length; i++) {
		time *= vec[i];
	}
	return time;
}

function isPrime(value) {
	for (let i = 2; i * i <= value; i++) {
		if (value % i == 0) return false;
	}
	return true;
}

function prime_factorization(value) {
	if (isPrime(value)) return [value];
	let vec = [];
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

function delete1(num) {
	if (num == 1) return "";
	if (num == -1) return "-";
	return num;
}

function mathJaxDivison(a, b) {
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
	plus: (a, b) => {
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
	minus: (a, b) => {
		return mathJaxStr.plus(a, -b);
	}
}
