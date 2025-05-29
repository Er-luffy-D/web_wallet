export const Word = ({ id, word }: { id: number; word: string }) => (
	<div className="flex items-center bg-slate-800 p-2 rounded-lg">
		<span className="text-gray-400 text-xs mr-2 w-5">{id}.</span>
		<span className="font-medium">{word}</span>
	</div>
);
