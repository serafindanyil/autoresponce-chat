import InputSearch from "@/components/input-search/input-search";

const InputSearchChat = () => {
	return (
		<div className="flex items-center gap-2">
			<InputSearch className="w-full" placeholder="Search or start new chat" />
		</div>
	);
};

export default InputSearchChat;
