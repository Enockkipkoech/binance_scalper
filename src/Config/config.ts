export const config = {
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	baseUrl: "https://testnet.binancefuture.com",
	QUANTITY_ADJUST: 10,
	MIN_PRICE: 10,
	PROFIT_PERCENT: 2,
	ENTRY_BUY_PERCENT: 0.9999,
	ENTRY_SELL_PERCENT: 1.0001,
	STOP_LOSS_PERCENT: 2, //callbackRate = 1 for 1%
};
