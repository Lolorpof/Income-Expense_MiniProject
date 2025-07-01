export default function LinkButton({
  isActive,
  children,
}: {
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={
        "rounded-2xl text-2xl font-bold text-gray-900 p-3 duration-300" +
        (!isActive &&
          " hover:bg-gray-400 hover:scale-110 hover:-translate-y-1 hover:cursor-pointer") +
        (isActive &&
          " underline backdrop-brightness-35 text-white cursor-default")
      }
      disabled={isActive}
    >
      {children}
    </button>
  );
}
