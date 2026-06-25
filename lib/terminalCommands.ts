import { certifications } from '../config/certifications';
import { OpenWindows } from '../config/openWindows';
import {
	HOME_DIR,
	isDirectory,
	listDirectory,
	readFile,
	resolveDirectory,
	resolvePath,
} from '../config/filesystem';
import { formatSnakeLog } from './snakeSession';
import { site } from '../config/site';

export type TerminalState = {
	cwd: string;
	cachedPublicIp?: string;
};

export type CommandResult = {
	response: string | null;
	newCwd?: string;
	clear?: boolean;
	cachedPublicIp?: string;
	openWindow?: keyof OpenWindows;
};

const HELP_TEXT = [
	'help          — show this message',
	'clear         — clear the terminal',
	'whoami        — current user',
	'hostname      — machine name',
	'uname -a      — system info',
	'pwd           — print working directory',
	'ls [path]     — list directory',
	'cd [path]     — change directory',
	'cat <file>    — print file contents',
	'echo <text>   — print text',
	'certs         — list certifications',
	'contact       — email and social links',
	'mail          — open Mail app',
	'play snake    — open Packet Snake game',
	'games.exe     — launch Packet Snake',
	'skills        — technical skills',
	'ip / ifconfig — network interfaces (public IP)',
	'ping <host>   — simulated ping',
	'traceroute <host> — simulated traceroute',
	'nslookup <host>   — simulated DNS lookup',
	'netstat       — listening ports (simulated)',
].join('<br/>');

const ALLOWED_HOSTS = /^[a-z0-9.-]+$/i;

function formatCertList(): string {
	return certifications
		.map((cert) => `• ${cert.name} (${cert.issuer})`)
		.join('<br/>');
}

async function fetchPublicIp(): Promise<string | null> {
	try {
		const res = await fetch('https://api.ipify.org?format=json');
		if (!res.ok) return null;
		const data = await res.json();
		return typeof data.ip === 'string' ? data.ip : null;
	} catch {
		return null;
	}
}

function simulatedPing(host: string): string {
	return [
		`PING ${host} (${host}) 56(84) bytes of data.`,
		`64 bytes from ${host}: icmp_seq=1 ttl=54 time=14.2 ms`,
		`64 bytes from ${host}: icmp_seq=2 ttl=54 time=13.8 ms`,
		`64 bytes from ${host}: icmp_seq=3 ttl=54 time=15.1 ms`,
		`64 bytes from ${host}: icmp_seq=4 ttl=54 time=14.0 ms`,
		`--- ${host} ping statistics ---`,
		`4 packets transmitted, 4 received, 0% packet loss`,
	].join('<br/>');
}

function simulatedTraceroute(host: string): string {
	const hops = [
		`traceroute to ${host} (${host}), 30 hops max, 60 byte packets`,
		' 1  192.168.1.1 (192.168.1.1)  2.341 ms  2.102 ms  2.045 ms',
		' 2  10.0.0.1 (10.0.0.1)  8.221 ms  8.104 ms  8.090 ms',
		' 3  isp-gw.net (203.0.113.1)  14.552 ms  14.401 ms  14.388 ms',
		` 4  ${host} (${host})  21.003 ms  20.884 ms  20.871 ms`,
	];
	return hops.join('<br/>');
}

function simulatedNslookup(host: string): string {
	return [
		`Server:		1.1.1.1`,
		`Address:	1.1.1.1#53`,
		'',
		`Name:	${host}`,
		`Address: 93.184.216.34`,
	].join('<br/>');
}

function simulatedNetstat(): string {
	return [
		'Active Internet connections (only servers)',
		'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
		'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN',
		'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
		'tcp        0      0 127.0.0.1:3000          0.0.0.0:*               LISTEN',
		'udp        0      0 0.0.0.0:51820           0.0.0.0:*',
	].join('<br/>');
}

async function networkInterfaces(
	cachedPublicIp?: string
): Promise<{ text: string; ip?: string }> {
	let publicIp = cachedPublicIp;

	if (!publicIp) {
		publicIp = (await fetchPublicIp()) ?? 'unavailable';
	}

	const text = [
		`1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536`,
		`    inet 127.0.0.1/8 scope host lo`,
		`2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500`,
		`    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0`,
		`    inet ${publicIp}/32 scope global dynamic noprefixroute eth0`,
	].join('<br/>');

	return {
		text,
		ip: publicIp !== 'unavailable' ? publicIp : undefined,
	};
}

function parseHost(input: string, command: string): string | null {
	const host = input.slice(command.length).trim();
	if (!host) return null;
	if (!ALLOWED_HOSTS.test(host)) return null;
	return host;
}

export async function runTerminalCommand(
	input: string,
	state: TerminalState
): Promise<CommandResult> {
	const trimmed = input.trim();
	if (!trimmed) return { response: null };

	const [command, ...args] = trimmed.split(/\s+/);
	const argLine = args.join(' ');

	switch (command) {
		case 'help':
			return { response: HELP_TEXT };

		case 'clear':
			return { response: null, clear: true };

		case 'whoami':
			return { response: site.username };

		case 'hostname':
			return { response: site.hostname };

		case 'uname': {
			if (args[0] === '-a') {
				return {
					response: `Linux ${site.hostname} 6.5.0-portfolio #1 SMP x86_64 GNU/Linux`,
				};
			}
			return { response: 'Linux' };
		}

		case 'pwd':
			return { response: state.cwd };

		case 'ls': {
			const target = argLine
				? resolveDirectory(state.cwd, argLine)
				: state.cwd;
			if (!target) {
				return { response: `ls: cannot access '${argLine}': No such file or directory` };
			}
			const entries = listDirectory(target);
			if (!entries) {
				return { response: `ls: cannot access '${argLine}': Not a directory` };
			}
			return { response: entries.join('  ') };
		}

		case 'cd': {
			const target = resolveDirectory(state.cwd, argLine || HOME_DIR);
			if (!target) {
				return {
					response: `bash: cd: ${argLine || '~'}: No such file or directory`,
				};
			}
			return { response: null, newCwd: target };
		}

		case 'cat': {
			if (!argLine) {
				return { response: 'cat: missing file operand' };
			}
			const filePath = resolvePath(state.cwd, argLine);
			if (!filePath) {
				return { response: `cat: ${argLine}: No such file or directory` };
			}
			if (filePath === '/var/games/snake.log') {
				return { response: formatSnakeLog().replace(/\n/g, '<br/>') };
			}
			const content = readFile(filePath);
			if (content === null) {
				return { response: `cat: ${argLine}: Is a directory` };
			}
			return { response: content };
		}

		case 'echo':
			return { response: argLine };

		case 'certs':
		case 'certifications':
			return { response: formatCertList() };

		case 'contact':
			return {
				response: [
					`Email: ${site.email}`,
					`GitHub: ${site.github}`,
					`LinkedIn: ${site.linkedin}`,
					'Tip: type mail to open the Mail app',
				].join('<br/>'),
			};

		case 'mail':
			return {
				response: 'Opening Mail...',
				openWindow: 'mail',
			};

		case 'play':
			if (args[0] === 'snake') {
				return {
					response: 'Opening Packet Snake...',
					openWindow: 'snake',
				};
			}
			return { response: 'usage: play snake' };

		case 'games.exe':
			return {
				response: 'Launching Packet Snake...',
				openWindow: 'snake',
			};

		case 'skills':
			return { response: readFile(`${HOME_DIR}/skills.txt`) };

		case 'ip':
		case 'ifconfig': {
			const result = await networkInterfaces(state.cachedPublicIp);
			return {
				response: result.text,
				cachedPublicIp: result.ip ?? state.cachedPublicIp,
			};
		}

		case 'ping': {
			const host = parseHost(trimmed, 'ping');
			if (!host) {
				return { response: 'usage: ping <hostname>' };
			}
			return { response: simulatedPing(host) };
		}

		case 'traceroute': {
			const host = parseHost(trimmed, 'traceroute');
			if (!host) {
				return { response: 'usage: traceroute <hostname>' };
			}
			return { response: simulatedTraceroute(host) };
		}

		case 'nslookup': {
			const host = parseHost(trimmed, 'nslookup');
			if (!host) {
				return { response: 'usage: nslookup <hostname>' };
			}
			return { response: simulatedNslookup(host) };
		}

		case 'netstat':
			return { response: simulatedNetstat() };

		default:
			return { response: `bash: ${command}: command not found` };
	}
}
