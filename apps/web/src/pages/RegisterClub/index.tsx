import EditClub from '@/assets/edit-club-detail.png';
import Ellipse from '@/assets/ellipse.svg';
import NewClub from '@/assets/new-club.png';
import Register from '@/assets/register-club.png';
export default function RegisterClub() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 py-11.5">
      <section className="flex flex-col items-center gap-5">
        <div className="itmes-center bg-primary-100 border-primary-400 text-primary-500 flex h-16 w-74.25 justify-center gap-2.5 rounded-[30px] border-2 px-7.5 py-3 text-[24px] leading-10 font-semibold">
          <div className="flex h-full items-center">
            <Ellipse />
          </div>
          동아리 정보 등록/수정
        </div>
        <span className="text-text-400 text-[20px]">
          작성자 유형에 따라 필요한 항목이 다릅니다. 현재 상황에 맞는 항목을 선택해주세요.
        </span>
      </section>
      <section className="flex gap-5">
        <div className="border-text-100 flex h-92.75 w-82.75 flex-col items-center gap-10 rounded-[20px] border bg-[#ffffff] px-7.5 py-10">
          <img src={EditClub} />
          <div className="flex flex-col items-center">
            <h1 className="text-text-700 text-[24px] font-semibold">동아리 정보 수정</h1>
            <span className="text-text-600 mt-10 w-65 text-center text-[14px] leading-4">
              이미 KONECT에 등록된 동아리의 소개, 사진, 상세정보를 추가하거나 수정할 수 있어요
            </span>
            <span className="text-text-600 pt-5 text-[14px]">대상 : 동아리 회장, 임원진</span>
          </div>
        </div>
        <div className="border-text-100 flex h-92.75 w-82.75 flex-col items-center gap-10 rounded-[20px] border bg-[#ffffff] px-7.5 py-10">
          <img src={NewClub} />
          <div className="flex flex-col items-center">
            <h1 className="text-text-700 text-[24px] font-semibold">신규 동아리 등록</h1>
            <span className="text-text-600 mt-10 w-60 text-center text-[14px] leading-4">
              아직 KONECT에 등록되지 않은 동아리의 기본 정보와 소개 정보를 제출할 수 있어요.
            </span>
            <span className="text-text-600 pt-5 text-[14px]">대상 : 미등록된 동아리의 관계자</span>
          </div>
        </div>
        <div className="border-text-100 flex h-92.75 w-82.75 flex-col items-center gap-10 rounded-[20px] border bg-[#ffffff] px-7.5 py-10">
          <img src={Register} />
          <div className="flex flex-col items-center">
            <h1 className="text-text-700 text-[24px] font-semibold">학교 동아리 목록 등록</h1>
            <span className="text-text-600 mt-10 w-69.5 text-center text-[14px] leading-4">
              총동 / 학생회 담당자가 학교 단위의 동아리 목록과 기본 정보를 한 번에 전달할 수 있어요.
            </span>
            <span className="text-text-600 pt-5 text-[14px]">대상 : 총동아리 연합회 / 학생회 담당자</span>
          </div>
        </div>
      </section>
    </main>
  );
}
