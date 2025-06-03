import { useState } from "react";
import "./App.css";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDNodeWallet } from "ethers";
import { Button } from "./component/Button";
import { Word } from "./component/Word";
import { Balance } from "./component/Balance";
import { DisplayWallet } from "./component/Wallet";

type WalletType = {
	id: number;
	Solpublic: string;
	Solprivate: string;
	Ethpublic: string;
	Ethprivate: string;
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

			// Solana Wallet (ed25519)
			const solPath = `m/44'/501'/0'/0'`;
			const solKey = derivePath(solPath, newSeed.toString("hex")).key;
			const solKeypair = nacl.sign.keyPair.fromSeed(solKey);
			const solanaKeypair = Keypair.fromSecretKey(solKeypair.secretKey);
			currentWallet.Solpublic = solanaKeypair.publicKey.toBase58();
			currentWallet.Solprivate = Buffer.from(solKeypair.secretKey).toString("hex");

			// Ethereum Wallet (secp256k1)
			const ethPath = `m/44'/60'/0'/0/0`;
			const ethWallet = HDNodeWallet.fromSeed(newSeed).derivePath(ethPath);
			currentWallet.Ethpublic = ethWallet.address;
			currentWallet.Ethprivate = ethWallet.privateKey;

			setWal([currentWallet as WalletType]);
		} catch (error) {
			console.error("Error creating wallet:", error);
		} finally {
			setLoading(false);
		}
	};

	const AddWallet = () => {
		if (!mnemonic.length) return;
		setLoading(true);
		try {
			const nextId = id + 1;
			setId(nextId);

			const newWallet: Partial<WalletType> = { id: nextId };

			// Solana Wallet
			const solPath = `m/44'/501'/${nextId}'/0'`;
			const solKey = derivePath(solPath, seed.toString("hex")).key;
			const solKeypair = nacl.sign.keyPair.fromSeed(solKey);
			const solanaKeypair = Keypair.fromSecretKey(solKeypair.secretKey);
			newWallet.Solpublic = solanaKeypair.publicKey.toBase58();
			newWallet.Solprivate = Buffer.from(solKeypair.secretKey).toString("hex");

			// Ethereum Wallet
			const ethPath = `m/44'/60'/${nextId}'/0/0`;
			const ethWallet = HDNodeWallet.fromSeed(seed).derivePath(ethPath);
			newWallet.Ethpublic = ethWallet.address;
			newWallet.Ethprivate = ethWallet.privateKey;

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
				{/* Balance */}
				<div>
					{seed.length > 0 && (
						<div className="flex-1">
							<div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-lg">
								<Balance />
							</div>
						</div>
					)}

					{/* Mnemonics */}
					<div className="flex-1 mt-3">
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
										<span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
											🔒 Store Securely
										</span>
									</div>
									{showMnemonic ? (
										<>
											<div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 bg-neutral-900/60 p-4 rounded-xl shadow">
												{mnemonic.map((word, idx) => (
													<Word key={idx} id={idx + 1} word={word} />
												))}
											</div>
											<p className="text-xs text-gray-400 mt-3">
												Write down this 12-word mnemonic phrase and store it securely. It can be used to recover all
												your wallets.
											</p>
										</>
									) : (
										""
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Wallets */}
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
									<DisplayWallet
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
