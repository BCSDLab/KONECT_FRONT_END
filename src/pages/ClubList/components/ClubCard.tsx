function ClubCard() {
  return (
    <div className="flex w-full items-start gap-3 rounded-lg bg-white p-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)]">
      <img src="https://placehold.co/52x52" className="rounded-sm border border-[#f4f6f9]" />
      <div>
        <div className="flex items-center gap-1">
          <div className="text-[15px] leading-5 font-extrabold text-[#021730]">CUT</div>
          <div className="text-[10px] leading-3 text-[#5a6b7f]">예체능분과</div>
        </div>
        <div className="mt-0.5 text-xs leading-4 text-[#5a6b7f]">설명설명설명설명설명설명설명설명설명설명</div>
        <div className="mt-1 flex gap-2.5">
          <div className="flex items-center rounded-sm bg-[#f4f6f9] px-1.5 py-[3px] text-[10px] text-[#5a6b7f]">
            #농구
          </div>
          <div className="flex items-center rounded-sm bg-[#f4f6f9] px-1.5 py-[3px] text-[10px] text-[#5a6b7f]">
            #농구
          </div>
          <div className="flex items-center rounded-sm bg-[#f4f6f9] px-1.5 py-[3px] text-[10px] text-[#5a6b7f]">
            #농구
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubCard;
