const defaultConfig = {
	version: 0, // number, 0
	useCustomEmojis: false,
	encodeLevel: undefined, // undefined | number // 1 - 9
	fontSize: 45, // number // 45
	font: undefined, // undefined | string //
	text: undefined, // undefined | string //
	assyst: {
		args: "", // string // {replace:"|\"|{args}}
	},
};
const emojis = {
		bad_image: "<:bad_image:1105128972364283954>",
		help: "<:questionmark:1099298038125695068>",
		help2: "<a:dumbass_think_already:1099938781504745483>",
	},
	BASE_REPO_URL = "https://github.com/Meqativ/ass-yst-tags/blob/main",
	YOU = "cute";

const sonicSaysJob = async (cfg) => {
	if (!cfg) cfg = {};
	if (!cfg?.text) cfg.text = cfg?.assyst.args;
	if (cfg?.version !== 0) throw new Error(`Version ${cfg.version} isn't available, use one of these: 0`);
	if (cfg?.assyst?.args === "raw") return BASE_REPO_URL + "/tags/sonicsays.js";
	if (typeof cfg?.fontSize !== "number" && typeof cfg?.fontSize !== "undefined") throw new Error(`Font size should be a number`);
	if (cfg?.assyst?.args.length === 0) {
		ctx.usesSONICSAYS ??= {};
		if (!ctx.usesSONICSAYS[message.author.id]) ctx.usesSONICSAYS[message.author.id] = 0;
		ctx.usesSONICSAYS[message.author.id] += 1;
		return `${ctx.usesSONICSAYS[message.author.id] < 5 ? emojis.help : emojis.help2}\`-t sonicsays [text...]\``;
		if (message?.referenced_message && message.referenced_message.content) cfg.text = message.referenced_message.content;
	}
	try {
		const [sonic, font] = await Promise.all([
			fetch(`https://cdn.discordapp.com/attachments/824020889234440232/1083513327700951093/Untitled160_20230310001307.png`)
				.then((res) => res.arrayBuffer())
				.then(ImageScript.decode),
			fetch(cfg?.font ?? `https://cdn.discordapp.com/attachments/824020889234440232/1084046492865662996/font.ttf`)
				.then((res) => res.arrayBuffer())
				.then((a) => new Uint8Array(a)),
		]);

		const layout = new ImageScript.TextLayout({
			maxHeight: 350,
			maxWidth: 525,
			wrapStyle: "word",
			wrapHardBreaks: false,
			horizontalAlign: "top",
		});

		let textOverlay = await ImageScript.Image.renderText(font, cfg?.fontSize - parseInt(cfg?.text.length) / (parseInt(cfg?.text.length) / 5), cfg?.text, 0xffffffee, layout);
		sonic.composite(textOverlay, 52, 119, 0);
		return sonic.encode(cfg?.encodeLevel);
	} catch (error) {
		return `${emojis.bad_image} Failed to generate image${
			error.message.includes("RangeError: Image has to be at least 1 pixel wide") ? ". (This tag doesn't support emojis and some other special characters)" : ""
		}\`\`\`js\n${error.stack}\`\`\``;
	}
};
