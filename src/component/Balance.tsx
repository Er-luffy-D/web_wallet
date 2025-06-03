import { useState, useEffect } from "react";
import { store } from "../store/store";
import axios from "axios";

type BlockchainType = "Solana" | "Ethereum" | "";
type BalanceData = {
	public: string;
	typeofblock: BlockchainType;
};

export const Balance = () => {
	const [data, setData] = useState<BalanceData>({ public: "", typeofblock: "" });
	const [balance, setBalance] = useState<number>(-1);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		// Set initial state
		const initialState = store.getState();
		setData({
			public: initialState.public,
			typeofblock: initialState.typeofblock,
		});

		// Subscribe to store updates
		const unsubscribe = store.subscribe(() => {
			const state = store.getState();
			setData({
				public: state.public,
				typeofblock: state.typeofblock,
			});
		});

		// Cleanup subscription on unmount
		return () => {
			unsubscribe();
		};
	}, []);

	const findWallet = async () => {
		const typeofblock = data.typeofblock;
		const publicKey = data.public;
		setLoading(true);
		try {
			if (typeofblock === "Solana") {
				const response = await axios.post(import.meta.env.VITE_SOLANA_URL, {
					jsonrpc: "2.0",
					id: 1,
					method: "getBalance",
					params: [publicKey],
				});
				const result = response.data.result.value;
				if (response.data.result) {
					const balanceinSol = result / 1e9;
					setBalance(balanceinSol);
					setLoading(false);
				} else {
					console.error("No balance found for the given address");
					setLoading(false);
				}
			} else if (typeofblock === "Ethereum") {
				// Convert public string to hex (if not already hex)

				const response = await axios.post(import.meta.env.VITE_ETHERIUM_URL, {
					jsonrpc: "2.0",
					id: 1,
					method: "eth_getBalance",
					params: [publicKey, "latest"],
				});
				console.log(response.data);
				const result = response.data.result;
				if (result) {
					const balanceinEth = parseInt(result, 16) / 1e18;
					setBalance(balanceinEth);
					setLoading(false);
				} else {
					console.error("No balance found for the given address");
					setLoading(false);
				}
			} else {
				console.error("Unsupported blockchain type");
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching wallet balance:", error);
			setLoading(false);
		}
	};

	if (data.public === "" || data.typeofblock === "") {
		return (
			<div className="text-center p-6 bg-neutral-900/80 rounded-xl border border-neutral-800">
				<p className="text-gray-400">
					<span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">Please</span>{" "}
					select a wallet to view the balance.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-neutral-900/80 rounded-xl p-6 shadow-lg border border-neutral-800 hover:border-indigo-500/30 transition-colors">
			<div className="flex flex-col items-center">
				<h3 className="font-medium text-lg mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
					{data.typeofblock} Wallet
				</h3>

				<button
					className="w-full max-w-xs px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
					onClick={findWallet}
					disabled={loading}
				>
					{loading ? "Loading..." : "Fetch Balance"}
				</button>

				{balance !== -1 && (
					<div className="mt-6 text-center">
						<p className="text-gray-400 mb-1">Balance</p>
						<p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
							{balance}
							<span className="text-xl ml-1">{data.typeofblock === "Solana" ? "SOL" : "ETH"}</span>
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
