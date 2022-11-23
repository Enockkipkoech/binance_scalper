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

		// Filter Exchange info

		//Raw info objects
		const { symbols, assets, exchangeFilters, rateLimits, timezone } = raw_Info;
		let _symbol_Info = raw_Info.symbols.map((token) => token.symbol);

		// Get Prices
		for (let i = 0; i < _symbol_Info.length; i++) {
			let _symbol = _symbol_Info[i];
			// console.log(`Getting Futures Exchange Info for ${_symbol} pair`);
			let baseAsset = raw_Info.symbols[i].baseAsset;
			let quoteAsset = raw_Info.symbols[i].quoteAsset;
			let marginAsset = raw_Info.symbols[i].marginAsset;

			// FEES
			let triggerProtect = raw_Info.symbols[1].triggerProtect;
			let liquidationFee = raw_Info.symbols[i].liquidationFee;
			let marketTakeBound = raw_Info.symbols[i].marketTakeBound;

			// TOTAL FEES
			const totalFees =
				Number(triggerProtect) +
				Number(liquidationFee) +
				Number(marketTakeBound);

			// console.log(`Total FEES: ${totalFees} %`);

			let multiplierDown = raw_Info.symbols[i].filters[0];
			// console.log(`multiplierDown`, multiplierDown);

			const price_Info = await getCurrentPrice(_symbol);
			// console.log(price_Info);

			// TODO Get price at Time intervals {"5m","15m","30m","1h","2h","4h","6h","12h","1d"}
			let hour_24 = "id";
			let min_15 = "15m";
			let min_5 = "5";

			const hour_24Data = await getPriceAtInterval(_symbol, hour_24);
			const min_15Data = await getPriceAtInterval(_symbol, min_15);
			const min_5Data = await getPriceAtInterval(_symbol, min_5);
			let priceIntervals = { hour_24Data, min_15Data, min_5Data };
			// console.log(
			// 	hour_24Data.lastPrice,
			// 	min_15Data.lastPrice,
			// 	min_5Data.lastPrice,
			// 	price_Info.price,
			// );

			// console.log(`${_symbol} Price change ${min_15Data.priceChangePercent} %`);

			// TODO Tabulate data
			// console.table(["SYMBOL", "LAST PRICE", "CURRENT PRICE", "PRICE CHANGE"]);
			console.table(
				[
					{
						SYMBOL: _symbol,
						LAST_PRICE_5M: min_5Data.lastPrice,
						CURRENT_PRICE: price_Info.price,
						PERCENT_CHANGE_5M: min_5Data.priceChangePercent,
						TOTAL_FEES: totalFees,
					},
				],
				[
					"SYMBOL",
					"LAST_PRICE_5M",
					"CURRENT_PRICE",
					"PERCENT_CHANGE_5M",
					"TOTAL_FEES",
				],
			);

			// TODO Check if values are positive or negative Math.abs() & math.sign()
			// TODO Compare priceChangePercent{15m and 5m }, lastPrice,  to check direction

			// TODO Return data
			// return {
			// 	_symbol,
			// 	baseAsset,
			// 	quoteAsset,
			// 	marginAsset,
			// 	totalFees,
			// 	price_Info,
			// 	priceIntervals,
			// };
		}
	} catch (error) {
		console.log(`🚩 Error getting Exchange Info 🚩 `);
	}
};
