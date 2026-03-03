import NotFoundCatImage from '@/assets/image/not-found-cat.webp';
import ErrorPageLayout from '@/components/common/ErrorPageLayout';
import { useErrorPageHomeNavigation } from '@/utils/hooks/useErrorPageHomeNavigation';

function NotFoundPage() {
  const handleGoHome = useErrorPageHomeNavigation();

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
