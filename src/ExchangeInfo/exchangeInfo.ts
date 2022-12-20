import axios from "axios";
import { _USDMClient } from "./clients";
import {
	KlineInterval,
	OrderSide,
	OrderType,
	OrderTimeInForce,
} from "../helpers";

export const getCurrentPrice = async (_symbol: string): Promise<any> => {
	let _price = await _USDMClient.getSymbolPriceTicker({
		symbol: _symbol,
	});
	return _price;
};
export const getTwentyFourHrStats = async () => {
	let stats = await _USDMClient.get24hrChangeStatististics();
	console.log("STATS:", stats);
};

interface BasicSymbolParam {
	symbol: string;
	isIsolated?: string; // "TRUE" or "FALSE"
}
type GetOrderParams = {
	symbol: string;
	orderId?: number;
	origClientOrderId?: string;
	isIsolated?: "TRUE" | "FALSE";
};

export const getPositions = async (symbol: GetOrderParams) => {
	try {
		let positions = await _USDMClient.getPositions(symbol);
		// console.log("Positions:", positions);
		return positions;
	} catch (error) {
		console.log(`Error getting open positions !`, error);
	}
};

export const getPriceAtInterval = async (symbol: string, period: string) => {
	let params = `symbol=${symbol}&period="${period}"`;
	try {
		let priceAtInterval = await axios({
			method: "get",
			url: `https://testnet.binancefuture.com/fapi/v1/ticker/24hr?${params}`,
		});
		// console.log(`price interval data:`, priceAtInterval.data);
		return priceAtInterval.data;
	} catch (error) {
		console.log(`Error getting Price at Interval periods!`);
	}
};

export const Exchange_Info = async () => {
	try {
		// Get Exchange Info
		const raw_Info = await _USDMClient.getExchangeInfo();
		// console.log(`Exchange Info:`, raw_Info);

		return raw_Info!;
	} catch (error) {
		console.log(`🚩 Error getting Exchange Info 🚩 `);
	}
};

export const getSymbolPriceTicker = async (symbol: string) => {
	try {
		let interval: KlineInterval = "1m";
		let params = {
			symbol,
			interval,
			startTime: Date.now() - 1000 * 60,
			endTime: Date.now(),
		};
		let price = await _USDMClient.getMarkPriceKlines(params);
		// console.log(`Price:`, price);
		return price;
	} catch (error) {
		console.log(`Error getting price ticker for ${symbol}`);
	}
};

export const placeOrder = async (
	symbol: string,
	side: OrderSide,
	type: OrderType,
	timeInForce: OrderTimeInForce,
	quantity: number,
	price: number,
) => {
	try {
		let order: any = await _USDMClient.submitNewOrder({
			symbol,
			side,
			type,
			timeInForce,
			quantity,
			price,
		});
		if (order.status === "FILLED") {
			console.log(`Order Placed:`, order);
		} else {
			console.log(`Error Placing Order `, order.status);
		}
	} catch (error) {
		console.log(`Error placing order!`);
	}
};

export const cancelOpenOrder = async (symbol: string, orderId: number) => {
	try {
		let order = await _USDMClient.setCancelOrdersOnTimeout({
			symbol,
			countdownTime: 1000 * 60 * 2,
		});
		console.log(`Order Cancelled:`, order);
	} catch (error) {
		console.log(`Error cancelling order!`);
	}
};
