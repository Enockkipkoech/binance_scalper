import axios from "axios";
import { _USDMClient } from "./clients";

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
		let positions = await _USDMClient.getOrder(symbol);
		console.log("Positions:", positions);
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
