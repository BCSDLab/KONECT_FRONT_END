import ClubCard from './components/ClubCard';
import SearchBar from './components/SearchBar';

function ClubList() {
  return (
    <div className="flex flex-1 flex-col">
      <SearchBar />
      <div className="mt-13 flex flex-1 flex-col gap-2 bg-[#fcfcfc] px-3 pt-2">
        <div className="text-[10px] leading-4 text-[#5a6b7f]">
          총 <span className="font-bold text-black">8개</span>의 동아리
        </div>
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
        <ClubCard />
      </div>
    </div>
  );
}

export default ClubList;
