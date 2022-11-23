import "dotenv/config";

import { MainClient, USDMClient, CoinMClient, WebsocketClient } from "binance";

// API Keys
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

const wsClient = new WebsocketClient({
	api_key,
	api_secret,
	beautify: true,
});

const _MainClient = new MainClient({
	api_key,
	api_secret,
});

const _USDMClient = new USDMClient({
	api_key,
	api_secret,
});

const _CoinMClient = new CoinMClient({
	api_key,
	api_secret,
});

export {
	wsClient,
	_MainClient,
	_USDMClient,
	_CoinMClient,
	api_key,
	api_secret,
};
