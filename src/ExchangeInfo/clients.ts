import { MainClient, USDMClient, CoinMClient, WebsocketClient } from "binance";

// API Keys
const api_key =
	"2e227c376c7a8673666fcbf104c82078a9c8467cbb1fca2c1dfa839a7b2818cb"; //process.env.API_KEY;
const api_secret =
	"704e5a4fcd1545fb265714b56fb535be83671a41844551f2ccf180bedaf73370"; //process.env.API_SECRET;
const baseUrl = "https://testnet.binancefuture.com";

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
	baseUrl,
	beautifyResponses: true,
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
