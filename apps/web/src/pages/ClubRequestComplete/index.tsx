import { Link } from 'react-router-dom';

import CompleteImage from '@/assets/image/complete-cat.jpg';

function ClubRequestComplete() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16 text-center text-black">
      <div className="flex w-full max-w-254 flex-col items-center gap-10">
        <section className="flex w-full flex-col items-center">
          <img
            className="h-auto w-full max-w-75 object-contain sm:max-w-125"
            src={CompleteImage}
            alt=""
            aria-hidden="true"
          />
          <div className="flex w-full flex-col items-center gap-5">
            <h1 className="text-text-600 text-[28px] font-bold sm:text-[36px]">동아리 소개 전송이 완료되었어요!</h1>
            <p className="text-text-400 font-medium sm:text-[20px]">
              보내주신 동아리 소개 내용은 확인 후 동아리 상세 페이지에 반영됩니다.
              <br />
              검토 과정에 따라 반영까지 시간이 소요됩니다.
            </p>
          </div>
        </section>
        <Link
          className="bg-primary-500 focus-visible:outline-primary-500 flex w-full items-center justify-center rounded-[20px] py-2.5 text-[18px] leading-10 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-[20px]"
          to="/"
        >
          메인으로
        </Link>
      </div>
    </main>
  );
}

export default ClubRequestComplete;
