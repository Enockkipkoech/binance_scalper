import { scalper, exitEngine } from "./Scalper";
import dateFormat from "dateformat";

import "./Database/connect";

const main = async () => {
	console.log(`****`.repeat(15));
	let message = `\n🔥 🔥 Starting bot at ${dateFormat(
		new Date(),
		"dddd,mmmm d,yyyy, h:MM:ss TT",
	)}🎇 🎇 `;
	console.log(message);
	console.log(`****`.repeat(15));

	if (!process.env.API_KEY && !process.env.API_SECRET) {
		let message = `Please set API_KEY & API_SECRET_KEY in the .env file! `;
		console.log(message);
	}

	// Execute Main Trading Functions
	scalper();
	// exitEngine();
};
main();
