import { queryAllOrders, IOrders } from "../Database";
import { _USDMClient, getCurrentPrice } from "../ExchangeInfo";
import { config } from "../Config";

export const exitEngine = async () => {
	try {
		// TODO CALCULATE PROFIT
		// TODO Query saved tokens
		const allOrders: any = await queryAllOrders();
		// console.log(`allOrders`, allOrders);

		if (allOrders.length > 0) {
			for (let i = 0; i < allOrders.length; i++) {
				const order = allOrders[i];
				// console.log(`order`, order);
				let symbol = order.symbol;
				let orderId = order.orderId;
				const totalFees = order.totalFees;

				let params = {
					symbol: symbol,
					orderId: orderId,
				};

				//  TODO Query open positions
				const openOrders = await _USDMClient.getAllOrders(params);
				console.log(`openOrders`, openOrders);

				const entryPrice = Number(openOrders[0].price);
				const cumQuote = Number(openOrders[0].cumQuote);
				const origQty = Number(openOrders[0].origQty);

				let PROFIT_PERCENT = config.PROFIT_PERCENT / 100;
				const cumQuotePlusFeesPlusProfit =
					Number(cumQuote) + Number((totalFees + PROFIT_PERCENT) * cumQuote);

				const exitPrice = cumQuotePlusFeesPlusProfit / Number(origQty);

				// TODO get current price
				const price_Info = await getCurrentPrice(symbol);
				console.log(`price_Info`, price_Info);
				const currentPrice = price_Info.price;
				// TODO current  position
				const PnL = ((currentPrice - entryPrice) / entryPrice) * 100; // PnL in percentage
				console.log(`Current  position for ${symbol} is ${PnL} %`);
				// const closePosition = await _USDMClient.(symbol);
				// console.log(`closePosition`, closePosition);
			}
			// TODO Compare open positions prices with saved tokens prices
			// send notification if profit is greater than 2%
		}
	} catch (error) {
		console.log(`Error in Exit Engine`, error);
	}
};
