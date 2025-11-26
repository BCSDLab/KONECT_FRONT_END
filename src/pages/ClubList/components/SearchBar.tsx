import SearchIcon from '@/assets/svg/search.svg';

function SearchBar() {
  return (
    <div className="fixed right-0 left-0 bg-white px-3 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 rounded-lg bg-[#f4f6f9] px-3 py-2">
        <SearchIcon />
        <input className="text-sm font-medium placeholder:text-[#738293]" placeholder="동아리 이름/태그로 검색" />
      </div>
    </div>
  );
}

export default SearchBar;
