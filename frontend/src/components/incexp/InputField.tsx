import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function InputField<T>({
  type,
  title,
  placeholder,
  value,
  changeStateFn,
  children,
  symbolValue,
  changeSymbolStateFn,
}: {
  type?: React.HTMLInputTypeAttribute;
  title: string;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  changeStateFn: React.Dispatch<React.SetStateAction<T>>;
  children?: React.ReactNode;
  symbolValue?: string;
  changeSymbolStateFn?: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <div className="w-full flex flex-wrap items-center">
        <h3 className="font-bold min-w-full">{title}</h3>
        <div className="flex">
          {type === "number" && changeSymbolStateFn && symbolValue && (
            <Select
              onValueChange={(value) => {
                changeSymbolStateFn(value);
              }}
              defaultValue={symbolValue}
            >
              <SelectTrigger className="w-fit mt-1 mr-2">
                <SelectValue placeholder="+ or -" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">+</SelectItem>
                <SelectItem value="subtract">-</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Input
            type={type}
            className={
              "mt-1 " +
              (type === "time"
                ? "min-w-fit w-fit"
                : type === "number"
                ? "min-w-fit w-fit"
                : "min-w-full w-full")
            }
            placeholder={placeholder}
            value={value}
            onChange={(e) => changeStateFn(e.target.value as T)}
          />
          {children}
        </div>
      </div>
    </>
  );
}
