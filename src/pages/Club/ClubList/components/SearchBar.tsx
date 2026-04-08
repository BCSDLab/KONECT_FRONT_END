import { type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '@/assets/svg/search.svg';

const SEARCH_PLACEHOLDER = '동아리 이름으로 검색';

interface SearchBarProps {
  isButton?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (e: SubmitEvent<HTMLFormElement>) => void;
  autoFocus?: boolean;
}

function SearchBar({ isButton, value, onChange, onSubmit, autoFocus }: SearchBarProps) {
  const wrapperClass =
    'fixed top-11 left-0 right-0 z-20 rounded-b-2xl bg-white px-3 py-2 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]';

  const content = (
    <div className="bg-indigo-5 flex h-12 items-center gap-2.5 rounded-2xl px-3">
      <SearchIcon className="size-4 shrink-0" />
      {isButton && !onChange ? (
        <div className="text-base font-medium text-indigo-300">{SEARCH_PLACEHOLDER}</div>
      ) : (
        <input
          className="flex-1 bg-transparent text-base font-medium text-indigo-300 outline-none placeholder:text-indigo-300"
          placeholder={SEARCH_PLACEHOLDER}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          autoFocus={autoFocus}
        />
      )}
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
