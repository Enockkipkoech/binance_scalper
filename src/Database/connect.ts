import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
	try {
		// if (!process.env.MONGO_URI) {
		// 	throw new Error("MONGO_URI not found in .env file");
		// }
		const mongoURI = `mongodb+srv://enock:MAiuKJaKV7va3Det@cluster0.jtj4c.mongodb.net/Binance_Futures?retryWrites=true&w=majority`;
		await mongoose.connect(mongoURI, {
			// process.env.MONGO_URI!, {
			keepAlive: true,
			connectTimeoutMS: 60000,
			socketTimeoutMS: 60000,
		});
		let message = `\n\n****MongoDB Connection Successful****`;

		console.log(message);
	} catch (error) {
		console.log(`Error in Database connection!${error}`);
	}
};

connectDB();
