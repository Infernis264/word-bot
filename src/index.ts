import * as TMI from "tmi.js";
import Auth from "./auth/Auth";
import {readFileSync} from "fs";

// put the channels the bot is enabled on
const CHANNELS = Auth.CHANNELS;

const client = new TMI.client({
	connection: {reconnect: true},
	identity: {
		username: Auth.USERNAME,
		password: Auth.TOKEN
	},
	// slice is necessary otherwise tmi.js adds pound signs to the beginning of elements in the array
	channels: CHANNELS.slice() 
});

const list: string[] = JSON.parse(readFileSync("./words.json").toString()) as any as string[];

var word: string;

function refreshWord() {
	word = list[Math.floor(Math.random()*list.length)];
	console.log(word);
}

client.on("message", async (channel: string, user: TMI.ChatUserstate, message: string) => {
	if (message.includes(word)) {
		client.say(channel, `@${user["display-name"]} guessed the word: ${word}!`);
		refreshWord();
	}
});

client.connect();
refreshWord();