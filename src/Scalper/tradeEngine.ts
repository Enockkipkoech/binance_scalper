import { _USDMClient, Exchange_Info } from "../ExchangeInfo";

const scalper = async () => {
	try {
		``;
		const FilteredExchangeInfo = await Exchange_Info();
		// console.log("FilteredExchangeInfo: ", FilteredExchangeInfo);
	} catch (error) {
		console.info(`Error executing Scalper Engine:`, error);
	}
};

export { scalper };
