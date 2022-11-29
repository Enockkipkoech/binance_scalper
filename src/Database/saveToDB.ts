import { Order } from "./models";

export const saveToDB = async (data: any) => {
	try {
		const order = new Order(data);
		await order.save();
		console.log("Saved Order to DB :", JSON.stringify(order, null, "\t"));
		return order;
	} catch (error) {
		console.log(`Error Saving Orders to DB`, error);
	}
};
