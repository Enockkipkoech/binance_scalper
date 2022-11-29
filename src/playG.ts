import { getPositions } from "./ExchangeInfo";

const playG = async () => {
	let symbol = "BNXUSDT";
	await getPositions({ symbol });
};
playG();
