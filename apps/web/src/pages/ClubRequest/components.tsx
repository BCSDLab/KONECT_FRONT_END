import { useId, useState, type ChangeEvent, type DragEvent, type ReactNode, type SubmitEventHandler } from 'react';
import { cn } from '@konect/utils/cn';
import { useDebouncedCallback } from '@konect/utils/use-debounced-callback';
import { useSuspenseQuery } from '@tanstack/react-query';

import type { University } from '@/apis/home/entity';
import { homeQueries } from '@/apis/home/queries';
import ArrowDropdownIcon from '@/assets/svg/arrow_drop_down-icon.svg';

import { getUniversityLabel } from './utils';

export const MAX_CLUB_NAME_LENGTH = 20;
export const MAX_SHORT_DESCRIPTION_LENGTH = 100;
export const MAX_FULL_INTRODUCTION_LENGTH = 100;
export const MAX_MEDIA_COUNT = 5;

export interface LocalMediaItem {
  file: File;
  id: string;
  previewUrl: string;
}

interface UniversityComboboxProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSelect: (university: University, universityLabel: string) => void;
  selectedUniversity: University | null;
}

export function RequestHeader({ description, title }: { description: string; title: string }) {
  return (
    <section className="flex flex-col items-center gap-5 text-center">
      <div className="border-primary-400 bg-primary-100 text-primary-500 box-border flex items-center justify-center gap-2.5 rounded-[30px] border-2 px-7.5 py-3 text-[20px] leading-8 font-semibold sm:text-[24px] sm:leading-9">
        <span className="bg-primary-500 size-2 rounded-full" aria-hidden="true" />
        {title}
      </div>
      <p className="text-text-400 leading-7 sm:text-[20px] sm:leading-10">{description}</p>
    </section>
  );
}

export function ClubRequestFormLayout({
  children,
  formMessage,
  isSubmitDisabled,
  isSubmitting,
  onSubmit,
}: {
  children: ReactNode;
  formMessage: string;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}) {
  return (
    <form className="flex w-full flex-col gap-10" onSubmit={onSubmit}>
      <section className="border-text-100 flex w-full flex-col gap-10 rounded-[20px] border bg-white px-5 py-8 sm:px-11 sm:py-10">
        {children}
        <RequestNotice />
      </section>

      <div className="flex flex-col gap-3">
        <button
          className="bg-primary-500 flex h-15.25 w-full items-center justify-center rounded-[20px] text-[18px] leading-10 font-semibold text-white transition-opacity enabled:hover:opacity-90 disabled:opacity-50 sm:text-[20px]"
          type="submit"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? '내용 보내는 중' : '내용 보내기'}
        </button>
        {formMessage && (
          <p className="text-text-500 text-center text-[16px] leading-7 font-semibold" aria-live="polite">
            {formMessage}
          </p>
        )}
      </div>
    </form>
  );
}

export function FieldGroup({
  children,
  helperText,
  label,
  required = false,
  trailingText,
}: {
  children: ReactNode;
  helperText?: string;
  label: string;
  required?: boolean;
  trailingText?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-start justify-between gap-4">
        <label className="text-text-900 text-[20px] leading-9 font-bold sm:text-[24px] sm:leading-10">
          {label}
          {required && <span className="text-[#DD2E44]"> *</span>}
        </label>
        {trailingText && (
          <span className="text-text-400 leading-9 font-medium sm:text-[20px] sm:leading-10">{trailingText}</span>
        )}
      </div>
      {children}
      {helperText && <p className="text-text-300 leading-8 font-medium sm:text-[20px] sm:leading-10">{helperText}</p>}
    </div>
  );
}

export function TextInputWithCount({
  ariaLabel,
  maxLength,
  onChange,
  placeholder,
  value,
}: {
  ariaLabel: string;
  maxLength: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="border-text-100 focus-within:border-primary-500 flex h-15.25 items-center gap-4 rounded-[20px] border bg-white px-5 transition-colors sm:px-7.5">
      <input
        className="placeholder:text-text-400 text-text-500 min-w-0 flex-1 bg-transparent text-[16px] leading-8 font-medium outline-none sm:text-[20px] sm:leading-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={ariaLabel}
      />
      <span className="text-text-400 shrink-0 text-[14px] leading-8 font-medium sm:text-[20px] sm:leading-10">
        {value.length}/{maxLength}
      </span>
    </div>
  );
}

export function PlainTextInput({
  ariaLabel,
  className,
  maxLength,
  onChange,
  placeholder,
  value,
}: {
  ariaLabel: string;
  className?: string;
  maxLength?: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div
      className={cn(
        'border-text-100 focus-within:border-primary-500 flex h-15.25 items-center rounded-[20px] border bg-white px-5 transition-colors sm:px-7.5',
        className
      )}
    >
      <input
        className="placeholder:text-text-400 text-text-500 min-w-0 flex-1 bg-transparent text-[16px] leading-8 font-medium outline-none sm:text-[20px] sm:leading-10"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={ariaLabel}
      />
    </div>
  );
}

export function UniversityCombobox({
  inputValue,
  onInputChange,
  onSelect,
  selectedUniversity,
}: UniversityComboboxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const updateQuery = useDebouncedCallback((value: string) => {
    setQuery(value.trim());
  });

  const { data: homeData } = useSuspenseQuery(homeQueries.detail(query ? { query } : {}));
  const universityOptions = homeData.universities ?? [];

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onInputChange(value);
    setIsOpen(true);
    updateQuery(value);
  };

  const handleUniversitySelect = (university: University) => {
    const universityLabel = getUniversityLabel(university);
    onSelect(university, universityLabel);
    setQuery(universityLabel);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <div className="border-text-100 focus-within:border-primary-500 flex items-center rounded-[20px] border bg-white px-5 py-2.5 transition-colors sm:px-7.5">
        <input
          className="placeholder:text-text-400 text-text-500 min-w-0 flex-1 bg-transparent leading-8 font-medium outline-none sm:text-[20px] sm:leading-10"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="(필수) 대학교를 선택하세요."
          aria-autocomplete="list"
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          aria-label="대학교명"
          autoComplete="off"
          role="combobox"
        />

        <button
          className="focus-visible:outline-primary-500 flex shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          type="button"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label={isOpen ? '대학교 목록 닫기' : '대학교 목록 열기'}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ArrowDropdownIcon className={cn('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} aria-hidden />
        </button>
      </div>
      {isOpen && (
        <div
          className="border-text-100 absolute top-18 right-0 left-0 z-10 max-h-100 overflow-y-auto rounded-[20px] border bg-white px-7.5 py-4 shadow-[0_20px_50px_0_rgba(2,23,48,0.08)]"
          id={listboxId}
          role="listbox"
        >
          {universityOptions.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {universityOptions.map((university) => (
                <li key={university.id}>
                  <button
                    className="text-text-400 hover:text-primary-600 focus-visible:outline-primary-500 flex w-full rounded-lg py-2 text-left text-[16px] leading-8 font-medium transition-colors focus-visible:outline-2 sm:text-[20px] sm:leading-10"
                    type="button"
                    role="option"
                    aria-selected={selectedUniversity?.id === university.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleUniversitySelect(university)}
                  >
                    {getUniversityLabel(university)}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-400 py-2 text-[16px] leading-8 font-medium sm:text-[20px] sm:leading-10">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function MediaUploader({
  mediaError,
  mediaItems,
  onAppendMediaFiles,
  onClearMediaItems,
  onRemoveMediaItem,
}: {
  mediaError: string;
  mediaItems: LocalMediaItem[];
  onAppendMediaFiles: (files: File[]) => void;
  onClearMediaItems: () => void;
  onRemoveMediaItem: (id: string) => void;
}) {
  const handleMediaInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAppendMediaFiles(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = '';
  };

  const mediaInputId = useId();

  const handleMediaDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onAppendMediaFiles(Array.from(event.dataTransfer.files));
  };

  return (
    <FieldGroup label="사진/영상 첨부" trailingText={`${mediaItems.length}/${MAX_MEDIA_COUNT}`}>
      <div
        className="border-text-100 flex min-h-62 cursor-pointer flex-col items-center justify-center rounded-[20px] border bg-white px-5 py-6 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleMediaDrop}
      >
        <input
          id={mediaInputId}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          onChange={handleMediaInputChange}
        />
        {mediaItems.length > 0 ? (
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="relative">
                <img className="size-50 w-full rounded-[10px] object-cover" src={item.previewUrl} alt="" />
                <button
                  className="bg-text-200 absolute top-2.5 right-2.5 flex size-7.5 items-center justify-center rounded-full transition-opacity hover:opacity-90"
                  type="button"
                  aria-label="첨부 이미지 삭제"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRemoveMediaItem(item.id);
                  }}
                >
                  <span className="relative size-3" aria-hidden="true">
                    <span className="absolute top-1/2 left-0 h-0.5 w-3 -translate-y-1/2 rotate-45 rounded-full bg-white" />
                    <span className="absolute top-1/2 left-0 h-0.5 w-3 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
                  </span>
                </button>
              </div>
            ))}
            {mediaItems.length < MAX_MEDIA_COUNT && (
              <label
                className="border-text-200 text-text-400 flex size-50 cursor-pointer flex-col items-center justify-center rounded-[20px] border"
                htmlFor={mediaInputId}
              >
                <span className="text-[40px] leading-none font-extralight">+</span>
                <span className="text-[14px] font-medium">영상, 이미지 추가</span>
              </label>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-5" htmlFor={mediaInputId}>
            <span className="bg-primary-500 flex h-13 items-center justify-center rounded-[20px] px-7 text-[18px] leading-10 font-semibold text-white sm:text-[20px]">
              사진 선택
            </span>
            <p className="text-text-400 leading-7 font-medium sm:text-[20px] sm:leading-normal">
              (선택) 첨부할 사진을 여기에 끌어놓거나, 사진 선택 버튼을 눌러 직접 사진을 선택해주세요.
              <br />( 파일 형식 : . JPG, PNG, GIF )
            </p>
          </label>
        )}
      </div>
      {mediaItems.length > 0 && (
        <button
          className="bg-primary-500 mt-2.5 flex h-13 w-39.5 items-center justify-center rounded-[20px] text-[20px] leading-10 font-semibold text-white transition-opacity hover:opacity-90"
          type="button"
          onClick={onClearMediaItems}
        >
          전부 지우기
        </button>
      )}
      <p className="text-text-300 leading-normal font-semibold sm:text-[20px]">
        동아리를 소개할 수 있는 사진이나 영상을 첨부해주세요.
        <br />
        첨부한 사진은 상세 페이지에서 16:9 영역 안에 표시되며, 이미지 비율에 따라 좌우 또는 상하 여백이 생길 수
        있습니다.
      </p>
      {mediaError && <p className="text-danger-600 font-semibold">{mediaError}</p>}
    </FieldGroup>
  );
}

export function RequestNotice() {
  return (
    <div className="border-text-200 text-text-500 rounded-[20px] border border-dashed p-3 leading-8 font-semibold sm:text-[20px] sm:leading-10">
      <p>입력해주신 정보는 내부 확인 후 동아리 상세 페이지에 반영됩니다.</p>
      <p>허위정보 혹은 부적절한 내용은 반영이 제한될 수 있습니다.</p>
    </div>
  );
}
