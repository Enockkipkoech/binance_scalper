import {
	_USDMClient,
	Exchange_Info,
	getPriceAtInterval,
	getCurrentPrice,
} from "../ExchangeInfo";
import { config } from "../Config";
import { saveToDB, IOrders, queryAllOrders } from "../Database";
import { INewOrder, OrderTimeInForce, OrderSide, OrderType } from "../helpers";

export const scalper = async () => {
	try {
		// Get Exchange Info
		const raw_Info: any = await Exchange_Info();
		// console.log(`Exchange Info:`, raw_Info);

		// Filter Exchange info
		let MultiOrders: any = [];
		console.log(`MultiOrders`, MultiOrders);

		//Raw info objects
		const { symbols, assets, exchangeFilters, rateLimits, timezone } = raw_Info;
		let _symbol_Info = raw_Info.symbols.map((token: any) => token.symbol);

		// Get Prices
		for (let i = 0; i < _symbol_Info.length; i++) {
			let _symbol = _symbol_Info[i];
			let status = raw_Info.symbols[i].status;
			const price_Info = await getCurrentPrice(_symbol);
			// console.log(price_Info); => { symbol: 'LTCUSDT', price: 72.61, time: 1669634328011 }

			let currentPrice = price_Info.price;

			if (status === "TRADING") {
				console.log(`Getting Futures Exchange Info for ${_symbol} pair`);

				let baseAsset = raw_Info.symbols[i].baseAsset;
				let quoteAsset = raw_Info.symbols[i].quoteAsset;
				let marginAsset = raw_Info.symbols[i].marginAsset;
				let pricePrecision = raw_Info.symbols[i].pricePrecision;
				let quantityPrecision = raw_Info.symbols[i].quantityPrecision;
				let minPrice = raw_Info.symbols[i].filters[0].minPrice;
				let maxPrice = raw_Info.symbols[i].filters[0].maxPrice;
				let minQty = raw_Info.symbols[i].filters[1].minQty;

				// FEES
				let triggerProtect = raw_Info.symbols[1].triggerProtect;
				let liquidationFee = raw_Info.symbols[i].liquidationFee;
				let marketTakeBound = raw_Info.symbols[i].marketTakeBound;

				// TOTAL FEES
				const totalFees = Number(liquidationFee) + Number(marketTakeBound);

				// console.log(`Total FEES: ${totalFees} %`);

				let multiplierDown = raw_Info.symbols[i].filters[6].multiplierDown; //Default 0.9000
				let multiplierUp = raw_Info.symbols[i].filters[6].multiplierUp; //Default 1.1000

				// Get price at Time intervals {"5m","15m","30m","1h","2h","4h","6h","12h","1d"}
				let hour_24 = "1d";
				let min_15 = "15m";
				let min_5 = "5";

				const hour_24Data = await getPriceAtInterval(_symbol, hour_24);
				const min_15Data = await getPriceAtInterval(_symbol, min_15);
				const min_5Data = await getPriceAtInterval(_symbol, min_5);
				let priceIntervals = { hour_24Data, min_15Data, min_5Data };

				let last5M_Price = min_15Data.lastPrice;
				let percentChange = Number(min_5Data.priceChangePercent);

				// Build Order params
				let type: OrderType = "LIMIT";
				let timeInForce: OrderTimeInForce = "GTC";
				let quantity = (
					minQty < 10 ? minQty + config.QUANTITY_ADJUST : minQty
				).toFixed(quantityPrecision);

				//TODO Check price to be greater than minPrice 10 and adjust accordingly to avoid notional error
				let price: string = currentPrice.toFixed(pricePrecision);

				// CALCULATE TAKE PROFIT PRICE
				const cumQuote = Number(quantity) * Number(price);
				const PROFIT_PERCENT = config.PROFIT_PERCENT / 100;
				const cumQuotePlusFeesPlusProfitBuy =
					cumQuote + Number(triggerProtect * cumQuote);
				let activationPriceOnProfitBuy = (
					cumQuotePlusFeesPlusProfitBuy / Number(quantity)
				).toFixed(pricePrecision);

				const cumQuotePlusFeesPlusProfitSell =
					cumQuote - Number(triggerProtect * cumQuote);
				let activationPriceOnProfitSell = (
					cumQuotePlusFeesPlusProfitSell / Number(quantity)
				).toFixed(pricePrecision);

				let activationPriceBuy = (
					currentPrice * config.ENTRY_BUY_PERCENT
				).toFixed(pricePrecision);
				let activationPriceSell = (
					currentPrice * config.ENTRY_SELL_PERCENT
				).toFixed(pricePrecision);

				let callbackRate = config.STOP_LOSS_PERCENT.toString();

				let deadline = (Date.now() + 1000 * 60 * 5).toString(); // 5 minutes from now
				let exit_Price = "0";

				// TODO Querry open Positons

				// Compare priceChangePercent{15m and 5m }, lastPrice,  to check direction

				if (
					Math.sign(percentChange) == 1 &&
					percentChange > 0.5 &&
					currentPrice >= last5M_Price
				) {
					// Positive percentage change
					let side: OrderSide = "BUY";
					exit_Price = activationPriceOnProfitBuy;

					let params: INewOrder = {
						symbol: _symbol,
						side,
						type,
						timeInForce,
						quantity,
						reduceOnly: "false",
						price,
						activationPrice: activationPriceOnProfitBuy,
						priceProtect: "TRUE",
						newOrderRespType: "RESULT",
					};

					MultiOrders.push(params);
					console.log(MultiOrders);
				} else if (
					Math.sign(percentChange) === -1 &&
					percentChange <= -0.5 &&
					currentPrice <= last5M_Price
				) {
					//negative Percentage change
					let side: OrderSide = "SELL";
					exit_Price = activationPriceOnProfitSell;

					let params: INewOrder = {
						symbol: _symbol,
						side,
						type,
						timeInForce,
						quantity,
						reduceOnly: "false",
						price,
						activationPrice: activationPriceOnProfitSell,
						priceProtect: "TRUE",
						newOrderRespType: "RESULT",
					};
					MultiOrders.push(params);
					console.log(MultiOrders);
				}

				// Tabulate data
				console.table(
					[
						{
							SYMBOL: _symbol,
							LAST_PRICE_5M: min_5Data.lastPrice,
							PERCENT_CHANGE_5M: min_5Data.priceChangePercent,
							CURRENT_PRICE: price_Info.price,
							ACTIVATION_PRICE: currentPrice,
							TOTAL_FEES: totalFees,
							EXIT_PRICE: exit_Price,
						},
					],
					[
						"SYMBOL",
						"LAST_PRICE_5M",
						"PERCENT_CHANGE_5M",
						"CURRENT_PRICE",
						"ACTIVATION_PRICE",
						"TOTAL_FEES",
						"EXIT_PRICE",
					],
				);

				//  Send Multiple Orders
				if (MultiOrders.length > 4) {
					console.log(`Multiple Orders Array to Submit: `, MultiOrders);
					_USDMClient
						.submitMultipleOrders(MultiOrders)
						.then((receipts: any) => {
							console.log("Orders Receipts:", receipts);
							// Save Orders to DB
							for (i = 0; i < receipts.length; i++) {
								let order = {
									orderId: receipts[i].orderId,
									symbol: receipts[i].symbol,
									clientOrderId: receipts[i].clientOrderId,
									side: receipts[i].side,
									type: receipts[i].type,
									timeInForce: receipts[i].timeInForce,
									quantity: receipts[i].origQty,
									price: receipts[i].price,
									activatePrice: receipts[i].activatePrice,
									cumQuote: receipts[i].cumQuote,
									stopPrice: receipts[i].stopPrice,
									takeProfitBuy: activationPriceOnProfitBuy,
									takeProfitSell: activationPriceOnProfitSell,
									totalFees: totalFees,
									updateTime: receipts[i].updateTime,
								};
								if (receipts[i].status === "NEW") {
									saveToDB(order);
								} else {
									console.log(`Error saving Order to DB!`);
								}
							}
						})
						.catch((err) => {
							console.log(`Error placing MultiOrders!`, err);
						});
					MultiOrders = [];
				}
			}
		}
	} catch (error) {
		console.info(`Error executing Scalper Engine:`, error);
	}
};
