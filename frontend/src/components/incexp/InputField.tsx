import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function InputField<T>({
  inputClassName,
  selectClassName,
  type,
  title,
  placeholder,
  value,
  changeStateFn,
  children,
  symbolValue,
  changeSymbolStateFn,
}: {
  inputClassName?: string;
  selectClassName?: string;
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
        <div className="relative flex w-full">
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
              <SelectContent className={`${selectClassName} `}>
                <SelectItem value="add">+</SelectItem>
                <SelectItem value="subtract">-</SelectItem>
              </SelectContent>
            </Select>
          )}
          {type === "text" && (
            <Textarea
              className="break-words placeholder-amber-100/60"
              placeholder={placeholder}
              value={value}
              onChange={(e) => changeStateFn(e.target.value as T)}
            ></Textarea>
          )}
          {type !== "text" && (
            <Input
              type={type}
              className={
                `${inputClassName} ` +
                "mt-1 " +
                (type === "time"
                  ? "min-w-fit w-fit"
                  : type === "number"
                  ? "min-w-fit w-fit"
                  : "min-w-full w-full")
              }
              placeholder={placeholder}
              value={
                type === "number" && value
                  ? Number(value) < 0
                    ? -1 * Number(value)
                    : value
                  : value
              }
              onChange={(e) => changeStateFn(e.target.value as T)}
              min={0}
            />
          )}
          {children}
        </div>
      </div>
    </>
  );
}
