export default function LinkButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="rounded-2xl text-2xl font-bold text-gray-900 p-3 hover:bg-gray-400 hover:scale-110 hover:-translate-y-1 hover:cursor-pointer duration-300">
      {children}
    </button>
  );
}
