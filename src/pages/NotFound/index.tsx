import { useNavigate } from 'react-router-dom';
import NotFoundCatImage from '@/assets/image/not-found-cat.webp';
import ErrorPageLayout from '@/components/common/ErrorPageLayout';
import { useAuthStore } from '@/stores/authStore';

function NotFoundPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/home' : '/', { replace: true });
  };

  return (
    <ErrorPageLayout
      imageSrc={NotFoundCatImage}
      imageAlt="오류 캐릭터"
      title="오류가 발생했어요"
      message={
        <>
          주소가 잘못 입력되었거나
          <br />
          삭제되어 페이지를 찾을 수 없어요
        </>
      }
      primaryLabel="홈으로 가기"
      onPrimaryClick={handleGoHome}
    />
  );
}

export default NotFoundPage;
