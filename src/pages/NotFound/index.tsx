import { useNavigate } from 'react-router-dom';
import NotFoundCatImage from '@/assets/image/not-found-cat.webp';
import { useAuthStore } from '@/stores/authStore';

function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/home' : '/', { replace: true });
  };

  return (
    <section className="bg-indigo-5 flex min-h-(--viewport-height) w-full flex-col items-center px-8 pt-[22vh]">
      <div className="flex w-full max-w-[323px] flex-col items-center gap-3">
        <img src={NotFoundCatImage} alt="오류 캐릭터" className="h-auto w-[243px]" />

        <div className="flex w-full flex-col items-center gap-[26px] text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-[24px] leading-[22px] font-bold tracking-[-0.408px] text-black">오류가 발생했어요</h1>
            <p className="text-[16px] leading-[22px] tracking-[-0.408px] text-indigo-200">
              주소가 잘못 입력되었거나
              <br />
              삭제되어 페이지를 찾을 수 없어요
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            className="text-indigo-5 w-full rounded-[10px] bg-[#69BFDF] py-[15px] text-[16px] leading-[22px] font-bold tracking-[-0.408px]"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
