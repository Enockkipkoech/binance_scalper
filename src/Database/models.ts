import { Schema, model } from "mongoose";

export interface IOrders {
	orderId: Number;
	symbol: String;
	side: String;
	type: String;
	timeInForce: String;
	quantity: Number;
	price: Number;
	stopPrice: Number;
	totalFees: Number;
	updateTime: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Create Schema
const OrderSchema = new Schema(
	{
		orderId: { type: Number, required: true },
		symbol: { type: String, required: true },
		side: { type: String, required: true },
		type: { type: String, required: true },
		timeInForce: { type: String, required: true },
		quantity: { type: Number, required: true },
		price: { type: Number, required: true },
		stopPrice: { type: Number, required: true },
		totalFees: { type: Number, required: true, default: 0 },
		updateTime: { type: Date, required: true, Default: Date.now() },
		createdAt: { type: Date, required: true, default: new Date() },
		updatedAt: { type: Date, required: true, default: new Date() },
	},
	{
		timestamps: true,
	},
);

// Model Creation
export const Order = model<IOrders>("Orders", OrderSchema, "orders");
