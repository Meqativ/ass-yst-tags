// MOST OF THE CODE IS TAKEN A VENDETTA PLUGIN,
// https://github.com/mugman174/vendetta-plugins/blob/main/plugins/urban/src/urban.js

const defaultConfig = {
	version: 0, // number, 0
	inline_links: false,
	assyst: {
		args: "", // string // {replace:"|\"|{args}}
	},
};

const urbanJob = async (config) => {
	const BASE_REPO_URL = "https://github.com/Meqativ/ass-yst-tags/blob/main",
		HIGHLIGHTS_REGEX = /\[(.*?)\]/g,
		YOU = "cute";
	if (config?.assyst?.args === "raw") return BASE_REPO_URL + "/tags/urban.js";

	const xml = (text) => "```xml\n" + text + "```";
	const helpText = (name, end = "") => xml(`< ${name} >`) + `<:questionmark:1099298038125695068>\`-t urban [sentence]\`` + end;

	const args = {
		inline_links: config?.inline_links, // boolean
		OnlyDefs: config?.assyst?.args?.startsWith?.("--only-defs") ? ((config.assyst.args = config?.assyst?.args?.slice(11, config?.assyst?.args?.length)), true) : false, // ?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿?¿
		word: config?.assyst?.args, // string
	};
	if (config?.assyst?.args?.length < 1) return helpText("No sentence provided");
	const { word, inline_links, OnlyDefs } = args;

	const query = encodeURIComponent(args.word);
	const url = `https://api.urbandictionary.com/v0/define?term=${query}`;
	const response = await fetch(url),
		status = response?.status,
		data = await response.json(),
		defObj = data.list?.[0];
	let definition = defObj?.definition;
	if (OnlyDefs) return smartRemoveSquareBrackets(definition);
	if (!definition) {
		return helpText(`No definition found for "${word.replaceAll("`", "`󠄴")}"${status !== undefined && status !== 200 ? `(${status})` : ""}`);
	}
	if (["330299657458679821", "843448897737064448"].includes(message?.author?.id) && query.toLowerCase().startsWith("cute")) definition = "you";
	const permalink = defObj.permalink;
	let output = xml(`< Definition for "${defObj.word}" >`);

	if (!inline_links) {
		output += `Source: <${permalink}>\n` + `${quote(smartRemoveSquareBrackets(definition))}\n\n`;
	} else {
		output += `\n# [\`  source  \`](${permalink} "Place where the definition was found")\n` + `${quote(replaceHighlighted(definition))}`;
	}
	return output;
	function quote(text) {
		return `> ${text.replaceAll("\n", "\n> ")}`;
	}

	function smartRemoveSquareBrackets(text) {
		return text.replace(HIGHLIGHTS_REGEX, (_, word) => word.trim());
	}

	function replaceHighlighted(text) {
		return text.replace(HIGHLIGHTS_REGEX, (match, word) => {
			word = word.trim();
			return `[${word}](<https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)}> "Definition for “${word}”")`;
		});
	}
};
