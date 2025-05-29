import { useState } from "react";

export const Wallet = ({
	id,
	Solprivate,
	Solpublic,
	Ethprivate,
	Ethpublic,
}: {
	id: number;
	Solprivate: Uint8Array;
	Solpublic: string;
	Ethprivate: Uint8Array;
	Ethpublic: string;
}) => {
	const [copied, setCopied] = useState<"none" | "Solprivate" | "Solpublic" | "Ethprivate" | "Ethpublic">("none");
	const [showSolPrivate, setShowSolPrivate] = useState(false);
	const [showEthPrivate, setShowEthPrivate] = useState(false);

	const handleCopy = (text: string, type: typeof copied) => {
		navigator.clipboard.writeText(text);
		setCopied(type);
		setTimeout(() => setCopied("none"), 1200);
	};

	return (
		<div className="bg-neutral-900/80 rounded-xl p-5 shadow-lg border border-neutral-800 hover:border-indigo-500/30 transition-colors mb-6">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
						<span className="text-indigo-300 text-sm font-bold">{id}</span>
					</div>
					<h3 className="font-medium">Wallet #{id}</h3>
				</div>
			</div>

			<div className="space-y-6">
				{/* Solana Section */}
				<div>
					<div className="flex items-center mb-3">
						<div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-2"></div>
						<h4 className="font-semibold text-indigo-400">Solana</h4>
					</div>

					<div className="mb-4">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm text-gray-400">Public Key</span>
							<button
								className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
								onClick={() => handleCopy(Solpublic, "Solpublic")}
							>
								{copied === "Solpublic" ? "✓ Copied" : "Copy"}
							</button>
						</div>
						<div className="bg-gray-800 p-3 rounded text-sm font-mono break-all text-green-400">{Solpublic}</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm text-gray-400">Private Key</span>
							<div className="flex gap-2">
								<button
									className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
									onClick={() => setShowSolPrivate(!showSolPrivate)}
								>
									{showSolPrivate ? "Hide" : "Show"}
								</button>
								{showSolPrivate && (
									<button
										className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
										onClick={() => handleCopy(Buffer.from(Solprivate).toString("hex"), "Solprivate")}
									>
										{copied === "Solprivate" ? "✓ Copied" : "Copy"}
									</button>
								)}
							</div>
						</div>
						{showSolPrivate && (
							<>
								<div className="bg-gray-800 p-3 rounded text-sm font-mono break-all text-gray-300">
									{Buffer.from(Solprivate).toString("hex")}
								</div>
								<p className="text-xs text-red-400 mt-2">
									⚠️ Never share your private key! Anyone with this can access your funds.
								</p>
							</>
						)}
					</div>
				</div>

				{/* Ethereum Section */}
				<div>
					<div className="flex items-center mb-3">
						<div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-2"></div>
						<h4 className="font-semibold text-yellow-400">Ethereum</h4>
					</div>

					<div className="mb-4">
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm text-gray-400">Public Key</span>
							<button
								className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
								onClick={() => handleCopy(Ethpublic, "Ethpublic")}
							>
								{copied === "Ethpublic" ? "✓ Copied" : "Copy"}
							</button>
						</div>
						<div className="bg-gray-800 p-3 rounded text-sm font-mono break-all text-green-400">{Ethpublic}</div>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<span className="text-sm text-gray-400">Private Key</span>
							<div className="flex gap-2">
								<button
									className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
									onClick={() => setShowEthPrivate(!showEthPrivate)}
								>
									{showEthPrivate ? "Hide" : "Show"}
								</button>
								{showEthPrivate && (
									<button
										className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition"
										onClick={() => handleCopy(Buffer.from(Ethprivate).toString("hex"), "Ethprivate")}
									>
										{copied === "Ethprivate" ? "✓ Copied" : "Copy"}
									</button>
								)}
							</div>
						</div>
						{showEthPrivate && (
							<>
								<div className="bg-gray-800 p-3 rounded text-sm font-mono break-all text-gray-300">
									{Buffer.from(Ethprivate).toString("hex")}
								</div>
								<p className="text-xs text-red-400 mt-2">
									⚠️ Never share your private key! Anyone with this can access your funds.
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
