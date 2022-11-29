export const config = {
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
	baseUrl: "https://testnet.binancefuture.com",
	QUANTITY_ADJUST: 10,
	PRICE_ADJUST: 0.1,
	PROFIT_PERCENT: 2,
	ENTRY_BUY_PERCENT: 0.9999,
	ENTRY_SELL_PERCENT: 1.0001,
	STOP_LOSS_PERCENT: 1, //callbackRate = 1 for 1%
};
