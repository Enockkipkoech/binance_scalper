import { scalper } from "./Scalper";
import dateFormat from "dateformat";
import express from "express";
const app = express();

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

	// API
	app.get("/binanceData", (req, res) => {
		let binanceData = req.body;
	});

	// Execute Main Trading Function
	scalper();
};
main();
