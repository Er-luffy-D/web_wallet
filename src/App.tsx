import { useState } from "react";
import "./App.css";

import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Button } from "./component/Button";
import { Word } from "./component/Word";
import { Wallet } from "./component/Wallet";

type WalletType = {
	id: number;
	Solpublic: string;
	Solprivate: Uint8Array;
	Ethpublic: string;
	Ethprivate: Uint8Array;
};

function App() {
	const [curWal, setWal] = useState<WalletType[]>([]);
	const [seed, setSeed] = useState<Buffer>(Buffer.alloc(0));
	const [mnemonic, setMnemonic] = useState<string[]>([]);
	const [showMnemonic, setShowMnemonic] = useState(false);
	const [id, setId] = useState(0);
	const [loading, setLoading] = useState(false);

	const toggleMnemonic = () => {
		setShowMnemonic(!showMnemonic);
	};

	const TypesOfchoices = [{ Sol: 501 }, { Eth: 60 }];

	const CreateWallet = async () => {
		setLoading(true);
		try {
			setWal([]);
			setId(0);
			const newMnemonic = generateMnemonic();
			setMnemonic(newMnemonic.split(" "));

			const newSeed = mnemonicToSeedSync(newMnemonic);
			setSeed(newSeed);

			const currentWallet: Partial<WalletType> = { id: 0 };
			TypesOfchoices.forEach((choice) => {
				const path = `m/44'/${Object.values(choice)[0]}'/0'/0'`;
				const { key } = derivePath(path, newSeed.toString("hex"));
				const secret = nacl.sign.keyPair.fromSeed(key).secretKey;
				const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
				//@ts-ignore
				currentWallet[`${Object.keys(choice)[0]}public` as keyof WalletType] = publicKey;
				//@ts-ignore
				currentWallet[`${Object.keys(choice)[0]}private` as keyof WalletType] = secret;
			});

			setWal([currentWallet as WalletType]);
		} catch (error) {
			console.error("Error creating wallet:", error);
		} finally {
			setLoading(false);
		}
	};

	const AddWallet = () => {
		if (!seed || seed.length === 0) return;
		setLoading(true);
		try {
			const nextId = id + 1;
			setId(nextId);

			const newWallet: Partial<WalletType> = { id: nextId };
			TypesOfchoices.forEach((choice) => {
				const path = `m/44'/${Object.values(choice)[0]}'/${nextId}'/0'`;
				const { key } = derivePath(path, seed.toString("hex"));
				const secret = nacl.sign.keyPair.fromSeed(key).secretKey;
				const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
				//@ts-ignore
				newWallet[`${Object.keys(choice)[0]}public` as keyof WalletType] = publicKey;
				//@ts-ignore
				newWallet[`${Object.keys(choice)[0]}private` as keyof WalletType] = secret;
			});

			setWal((prev) => [...prev, newWallet as WalletType]);
		} catch (error) {
			console.error("Error adding wallet:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans px-4 py-8">
			<header className="mb-8 text-center">
				<h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
					Web Based Wallet
				</h1>
				<p className="text-gray-300 max-w-2xl mx-auto">
					Generate and manage hierarchical deterministic (HD) wallets for multiple chains from a single mnemonic phrase.
					Securely store your mnemonic as it controls all generated wallets.
				</p>
			</header>

			<div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
				<div className="flex-1">
					<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
						<div className="flex justify-center md:justify-between gap-4 mb-6 flex-wrap">
							<Button onClick={CreateWallet} loading={loading}>
								{seed.length === 0 ? "Create New Wallet" : "Reset Wallet"}
							</Button>
							<Button onClick={AddWallet} disabled={seed.length === 0 || loading} loading={loading}>
								Add Wallet
							</Button>
						</div>

						{seed.length > 0 && (
							<div className="mt-6">
								<div
									className="flex items-center justify-between mb-3 hover:backdrop-brightness-75 p-4 rounded-2xl cursor-pointer"
									onClick={toggleMnemonic}
								>
									<h2 className="text-xl font-semibold">Recovery Phrase</h2>
									<span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">🔒 Store Securely</span>
								</div>
								{showMnemonic ? (
									<>
										<div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 bg-neutral-900/60 p-4 rounded-xl shadow">
											{mnemonic.map((word, idx) => (
												<Word key={idx} id={idx + 1} word={word} />
											))}
										</div>
										<p className="text-xs text-gray-400 mt-3">
											Write down this 12-word mnemonic phrase and store it securely. It can be used to recover all your
											wallets.
										</p>
									</>
								) : (
									<div className="bg-neutral-900/60 p-4 rounded-xl shadow text-center text-gray-400">
										Click to reveal recovery phrase
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="flex-1">
					<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
						<h2 className="text-xl font-semibold mb-4">Generated Wallets</h2>
						<div className="space-y-4">
							{curWal.length === 0 ? (
								<div className="text-center py-8">
									<div className="text-gray-400 mb-2">No wallets generated yet</div>
									<p className="text-sm text-gray-500">
										Click "Create New Wallet" to generate your first wallet and mnemonic phrase
									</p>
								</div>
							) : (
								curWal.map((wal) => (
									<Wallet
										key={wal.id}
										id={wal.id}
										Solprivate={wal.Solprivate}
										Solpublic={wal.Solpublic}
										Ethprivate={wal.Ethprivate}
										Ethpublic={wal.Ethpublic}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			<footer className="mt-12 text-center text-gray-500 text-sm">
				<p>Always use this tool in a secure environment. Never share your private keys or mnemonic phrase.</p>
			</footer>
		</div>
	);
}

export default App;
