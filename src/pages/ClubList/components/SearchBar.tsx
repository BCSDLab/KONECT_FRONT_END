// src/pages/ClubList/components/SearchBar.tsx
import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@/assets/svg/search.svg';

interface SearchBarProps {
  isButton?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

function SearchBar({ isButton, value, onChange, onSubmit }: SearchBarProps) {
  const wrapperClass = 'fixed left-0 right-0 bg-white px-3 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.04)] z-10';

  const content = (
    <div className="bg-indigo-5 flex items-center gap-2.5 rounded-lg px-3 py-2">
      <SearchIcon />
      <input
        className="flex-1 bg-transparent font-medium outline-none placeholder:text-indigo-200"
        placeholder="동아리 이름/태그로 검색"
        readOnly={isButton && !onChange}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
    </div>
  );

  if (isButton) {
    return (
      <Link to="/clubs/search" className={wrapperClass}>
        {content}
      </Link>
    );
  }

  if (onSubmit) {
    return (
      <form onSubmit={onSubmit} className={wrapperClass}>
        {content}
      </form>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}

export default SearchBar;
