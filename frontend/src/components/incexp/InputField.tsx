import { Input } from "../ui/input";

export default function InputField<T>({
  type,
  title,
  placeholder,
  value,
  changeStateFn,
  children,
  childChangeStateFn,
}: {
  type?: React.HTMLInputTypeAttribute;
  title: string;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  changeStateFn: React.Dispatch<React.SetStateAction<T>>;
  children?: React.ReactNode;
  childChangeStateFn?: React.Dispatch<React.SetStateAction<T>>;
}) {
  return (
    <>
      <div className="w-full flex flex-wrap items-center">
        <h3 className="font-bold min-w-full">{title}</h3>
        <Input
          type={type}
          className={
            "mt-1 " +
            (type === "time" ? "min-w-fit w-fit" : "min-w-full w-full")
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => changeStateFn(e.target.value as T)}
        />
        {children}
      </div>
    </>
  );
}
