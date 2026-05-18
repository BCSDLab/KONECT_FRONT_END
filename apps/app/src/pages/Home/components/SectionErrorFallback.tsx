function SectionErrorFallback() {
  return (
    <div
      role="alert"
      className="flex min-h-22.75 w-full items-center justify-center rounded-[20px] bg-white px-4 py-5 shadow-[0_0_3px_rgba(0,0,0,0.2)]"
    >
      <span className="text-sub2 text-indigo-300">불러오는 중 오류가 발생했어요</span>
    </div>
  );
}

export default SectionErrorFallback;
