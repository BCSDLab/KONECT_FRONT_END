import NotFoundCatImage from '@/assets/image/not-found-cat.webp';
import ErrorPageLayout from '@/components/common/ErrorPageLayout';
import { useErrorPageHomeNavigation } from '@/utils/hooks/useErrorPageHomeNavigation';

function ServerErrorPage() {
  const handleGoHome = useErrorPageHomeNavigation();

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
