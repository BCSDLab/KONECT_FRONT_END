import { useNavigate } from 'react-router-dom';
import NotFoundCatImage from '@/assets/image/not-found-cat.webp';
import ErrorPageLayout from '@/components/common/ErrorPageLayout';
import { useAuthStore } from '@/stores/authStore';

function ServerErrorPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/home' : '/', { replace: true });
  };

  return (
    <ErrorPageLayout
      imageSrc={NotFoundCatImage}
      imageAlt="서버 오류 캐릭터"
      title="오류가 발생했어요"
      message={
        <>
          서버에 일시적인 문제가 생겼어요
          <br />
          잠시 후 다시 시도해 주세요
        </>
      }
      primaryLabel="홈으로 가기"
      onPrimaryClick={handleGoHome}
    />
  );
}

export default ServerErrorPage;
