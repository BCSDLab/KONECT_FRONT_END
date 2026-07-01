import { useState } from 'react';
import UniversityDropdown from '@/components/UniversityDropdown';
import InfoBadge from '../InfoBadge';
export default function RegisterClubList() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  //dropdown 확인용 임시 데이터
  const universityOption = [
    { id: 'none', name: '(필수) 대학교를 선택해주세요' },
    { id: 'koreatech', name: '한국기술교육대학교' },
  ];
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-4 py-11.5 sm:px-6 lg:px-0">
      <section className="flex w-full flex-col items-center gap-5">
        <InfoBadge className="max-w-93">동아리 소개 내용을 보내주세요</InfoBadge>
        <span className="text-text-400 text-[20px]">입력하신 내용은 확인 후 동아리 상세 페이지에 등록돼요.</span>
      </section>
      <form className="flex w-full max-w-254 flex-col gap-10">
        <section className="flex w-full flex-col gap-10 rounded-[20px] border border-[#E7EBEF] bg-[#FFF] px-5 py-8 sm:px-11 sm:py-10">
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex">
              <p className="text-text-900 text-[24px] font-bold">대학교명</p>
              <p className="text-[24px] font-bold text-[#DD2E44]">*</p>
            </div>
            <UniversityDropdown
              value={selectedUniversity}
              onChange={setSelectedUniversity}
              options={universityOption}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex w-full items-start justify-between">
              <span className="text-text-900 text-[24px] font-bold">파일 첨부</span>
              <button
                type="button"
                className="bg-primary-500 flex h-13 w-47 items-center justify-center rounded-[20px] px-1.5 py-5 text-[20px] leading-10 font-semibold text-white"
              >
                엑셀 양식 다운로드
              </button>
            </div>
            <div className="border-text-100 flex h-62 w-full flex-col items-center justify-center gap-2.5 rounded-[20px] border px-7.5 py-6.5">
              <p className="text-text-400 text-center text-[20px] font-medium">
                첨부할 사진을 여기에 끌어놓거나,
                <br />
                파일 선택 버튼을 눌러 직접 파일을 선택해주세요.
              </p>
              <button
                type="button"
                className="bg-primary-500 h-13 w-39.5 rounded-[20px] text-[20px] leading-10 font-semibold text-white"
              >
                파일 선택
              </button>
            </div>
            <div className="flex w-full justify-between">
              <p className="text-text-300 text-[20px] font-semibold">
                학교 동아리 정보가 포함된 파일을 업로드 해주세요.
              </p>
              <p className="text-text-400 text-right text-[20px] leading-10 font-medium">0/5</p>
            </div>
          </div>
          <div className="border-text-200 flex self-stretch rounded-[20px] border border-dashed p-3">
            <p className="text-text-500 px-2.5 text-[20px] leading-10 font-semibold">
              입력해주신 정보는 내부 확인 후 동아리 상세 페이지에 반영됩니다.
              <br />
              허위정보 혹은 부적절한 내용은 반영이 제한될 수 있습니다.
            </p>
          </div>
        </section>
        <button
          type="submit"
          className="bg-primary-500 flex h-15.25 w-full items-center justify-center self-stretch rounded-[20px] px-5 py-1.5 text-[20px] leading-10 font-semibold text-white"
        >
          내용 보내기
        </button>
      </form>
    </main>
  );
}
