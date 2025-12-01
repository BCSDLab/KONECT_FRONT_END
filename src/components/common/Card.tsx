function Card({ children }: { children: React.ReactNode }) {
  return <div className="border-indigo-5 flex w-full flex-col gap-3 rounded-lg border bg-white p-3">{children}</div>;
}

export default Card;
