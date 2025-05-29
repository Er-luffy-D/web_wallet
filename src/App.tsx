import { useState } from "react";
import "./App.css";

import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

type WalletType = {
	id: number;
	publickey: string;
	privateKey: Uint8Array;
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
			const path = `m/44'/501'/${id}'/0'`;
			const { key } = derivePath(path, newSeed.toString("hex"));
			const secret = nacl.sign.keyPair.fromSeed(key).secretKey;
			const publick = Keypair.fromSecretKey(secret).publicKey.toBase58();

			setWal([{ id: 0, publickey: publick, privateKey: secret }]);
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
			const path = `m/44'/501'/${nextId}'/0'`;
			const derivedSeed = derivePath(path, seed.toString("hex")).key;
			const secret = nacl.sign.keyPair.fromSeed(derivedSeed.slice(0, 32)).secretKey;
			const publick = Keypair.fromSecretKey(secret).publicKey.toBase58();
			setWal((prev) => [...prev, { id: nextId, publickey: publick, privateKey: secret }]);
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
					Solana HD Wallet Generator
				</h1>
				<p className="text-gray-300 max-w-2xl mx-auto">
					Generate and manage hierarchical deterministic (HD) wallets for Solana from a single mnemonic phrase. Securely
					store your mnemonic as it controls all generated wallets.
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
									className="flex items-center justify-between mb-3 hover:backdrop-brightness-75 p-4 rounded-2xl	"
									onClick={toggleMnemonic}
								>
									<h2 className="text-xl font-semibold">Recovery Phrase</h2>
									{/* here */}
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
									""
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
									<Wallet key={wal.id} id={wal.id} privateKey={wal.privateKey} publicKey={wal.publickey} />
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

const Button = ({
	children,
	onClick,
	disabled,
	loading,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled?: boolean;
	loading?: boolean;
}) => (
	<button
		onClick={onClick}
		disabled={disabled || loading}
		className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center min-w-40 ${
			disabled
				? "bg-gray-700 text-gray-500 cursor-not-allowed"
				: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
		}`}
	>
		{loading ? (
			<>
				<svg
					className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Processing...
			</>
		) : (
			children
		)}
	</button>
);

const Word = ({ id, word }: { id: number; word: string }) => (
	<div className="flex items-center bg-slate-800 p-2 rounded-lg">
		<span className="text-gray-400 text-xs mr-2 w-5">{id}.</span>
		<span className="font-medium">{word}</span>
	</div>
);

const Wallet = ({ id, privateKey, publicKey }: { id: number; privateKey: Uint8Array; publicKey: string }) => {
	const privateKeyHex = Buffer.from(privateKey).toString("hex");
	const [copied, setCopied] = useState<"none" | "private" | "public">("none");
	const [showPrivateKey, setShowPrivateKey] = useState(false);

	const handleCopy = (text: string, type: "private" | "public") => {
		navigator.clipboard.writeText(text);
		setCopied(type);
		setTimeout(() => setCopied("none"), 1200);
	};

	return (
		<div className="bg-neutral-900/80 rounded-xl p-5 shadow-lg border border-neutral-800 hover:border-indigo-500/30 transition-colors">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center">
					<div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
						<span className="text-indigo-300 text-sm font-bold">{id}</span>
					</div>
					<h3 className="font-medium">Wallet #{id}</h3>
				</div>
				<div className="flex space-x-2">
					<button
						className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition text-gray-300"
						onClick={() => setShowPrivateKey(!showPrivateKey)}
					>
						{showPrivateKey ? "Hide Private Key" : "Show Private Key"}
					</button>
				</div>
			</div>

			<div className="mb-3">
				<div className="flex items-center justify-between mb-1">
					<span className="text-sm text-gray-400">Public Key</span>
					<button
						className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
						onClick={() => handleCopy(publicKey, "public")}
					>
						{copied === "public" ? "✓ Copied" : "Copy"}
					</button>
				</div>
				<div className="bg-gray-800 p-2 rounded text-sm font-mono break-all text-green-400">{publicKey}</div>
			</div>

			{showPrivateKey && (
				<div>
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm text-gray-400">Private Key</span>
						<button
							className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
							onClick={() => handleCopy(privateKeyHex, "private")}
						>
							{copied === "private" ? "✓ Copied" : "Copy"}
						</button>
					</div>
					<div className="bg-gray-800 p-2 rounded text-sm font-mono break-all text-gray-300">{privateKeyHex}</div>
					<p className="text-xs text-red-400 mt-1">
						⚠️ Never share your private key! Anyone with this can access your funds.
					</p>
				</div>
			)}
		</div>
	);
};

export default App;
