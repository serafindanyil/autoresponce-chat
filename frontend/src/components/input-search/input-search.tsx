import { Search } from "lucide-react";
import Input from "@/ui/input/input";

type InputSearchProps = React.ComponentProps<typeof Input>;

const InputSearch = (inputProps: InputSearchProps) => {
	return (
		<div className="relative w-full">
			<Input {...inputProps} className="pl-10" />
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/80 w-4 h-4 " />
		</div>
	);
};

export default InputSearch;
