import { Order } from "./models";

export const queryAllOrders = async () => {
	try {
		const orders = await Order.find();
		// console.log("Orders from DB :", JSON.stringify(orders, null, "\t"));
		return orders;
	} catch (error) {
		console.log(`Error Querying Orders from DB`, error);
	}
};
