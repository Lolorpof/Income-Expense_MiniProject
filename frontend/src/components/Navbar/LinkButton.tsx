export default function LinkButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={
        "rounded-2xl text-base md:text-xl lg:text-2xl font-bold text-amber-400 p-1.5 md:p-2 lg:p-3 duration-300" +
        (!isActive &&
          " hover:bg-black/20 hover:scale-110 hover:-translate-y-1 hover:cursor-pointer") +
        (isActive &&
          " underline backdrop-brightness-35 text-white cursor-default")
      }
      disabled={isActive}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
