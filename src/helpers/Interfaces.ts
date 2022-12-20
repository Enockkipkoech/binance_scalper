export type BooleanString = "true" | "false";
export type BooleanStringCapitalised = "TRUE" | "FALSE";

export type OrderTimeInForce = "GTC" | "IOC" | "FOK" | "GTE_GTC";
export type OrderResponseType = "ACK" | "RESULT" | "FULL";

export type OrderSide = "BUY" | "SELL";
export type OrderType =
	| "LIMIT"
	| "MARKET"
	| "STOP"
	| "STOP_MARKET"
	| "TAKE_PROFIT"
	| "TAKE_PROFIT_MARKET"
	| "TRAILING_STOP_MARKET";

export interface INewOrder {
	symbol: string;
	side: string;
	type: string;
	timeInForce: string;
	quantity: string;
	reduceOnly?: BooleanString;
	price?: string;
	stopPrice?: string;
	closePosition?: BooleanString;
	activationPrice?: string;
	callbackRate?: string;
	priceProtect?: BooleanStringCapitalised;
	timestamp?: string;
	newOrderRespType?: OrderResponseType;
}

export type KlineInterval =
	| "1m"
	| "3m"
	| "5m"
	| "15m"
	| "30m"
	| "1h"
	| "2h"
	| "4h"
	| "6h"
	| "8h"
	| "12h"
	| "1d"
	| "3d"
	| "1w"
	| "1M";
