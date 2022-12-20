import { queryAllOrders, IOrders } from "../Database";
import {
	_USDMClient,
	getCurrentPrice,
	getPositions,
	getSymbolPriceTicker,
	placeOrder,
	cancelOpenOrder,
} from "../ExchangeInfo";

import { OrderSide, OrderType, OrderTimeInForce } from "../helpers";

export const exitEngine = async () => {
	try {
		// TODO CALCULATE PROFIT
		// TODO Query saved tokens
		const savedDbOrders: any = await queryAllOrders();
		// console.log(`Saved Orders`, savedDbOrders);

		if (savedDbOrders.length > 0) {
			for (let i = 0; i < savedDbOrders.length; i++) {
				const order = savedDbOrders[i];
				// console.log(`order`, order);

				let symbol = order.symbol;
				let orderId = order.orderId;
				let _side = order.side;
				let createdAt = order.createdAt;
				const totalFees = order.totalFees;

				let params = {
					symbol: symbol,
					orderId: orderId,
				};

				//  TODO Query open positions and orders
				const openOrders = await _USDMClient.getAllOrders(params); // NOT VIABLE
				// console.log(`openOrders`, openOrders);

				// Get Positions
				const positions: any = await getPositions(params);
				// console.log(`positions`, positions);

				const unRealizedProfit = positions[0].unRealizedProfit; // value in USDT
				const quantity = positions[0].positionAmt;

				// TODO get current price
				const price_Info = await getCurrentPrice(symbol);
				// console.log(`price_Info`, price_Info);
				const currentPrice = price_Info.price;
				// TODO current  position
				console.log(
					`Unrealized Profit for ${symbol} is ${unRealizedProfit} USDT `,
				);

				// TODO getPriceAtInterval
				const KlinePrices = await getSymbolPriceTicker(symbol);
				// console.log(`KlinePrices`, KlinePrices);

				// TODO Compare open positions prices with saved tokens prices
				// send notification if profit is greater than 2%
				if (unRealizedProfit > 2) {
					// TODO CLOSE TRADES / EXIT POSITIONS / TAKE PROFIT
					let side: OrderSide = _side === "BUY" ? "SELL" : "BUY";
					let type: OrderType = "LIMIT";
					let timeInForce: OrderTimeInForce = "GTC";
					let price = currentPrice;
					let exitOrder = await placeOrder(
						symbol,
						side,
						type,
						timeInForce,
						quantity,
						price,
					);
					console.log(`exitOrder`, exitOrder);
					// TODO SEND NOTIFICATION
					let msg = `Unrealized Profit for ${symbol} is ${unRealizedProfit} USDT `;
					msg += `Place Exit Order for ${symbol} at ${currentPrice} USDT `;
				}

				// TODO _USDMClient.setCancelOrdersOnTimeout // CANCEL ORDERS ON TIMEOUT

				if (unRealizedProfit < -10) {
					const closePosition = await cancelOpenOrder(symbol, orderId);
					console.log(
						`Close Position ID: ${orderId} of ${symbol}`,
						closePosition,
					);
				}
			}
		} else {
			console.log(`[EMPTY DB] No Saved Orders in DB`);
		}
	} catch (error) {
		console.log(`Error in Exit Engine`, error);
	}
};
exitEngine();
