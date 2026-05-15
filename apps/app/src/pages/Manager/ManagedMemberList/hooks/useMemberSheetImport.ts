import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpsertManagedClubSheetMutation } from '@/pages/Manager/hooks/useManagedMemberMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { isApiError } from '@/utils/ts/error/apiError';
import { getApiErrorMessage } from '@/utils/ts/error/apiErrorMessage';

const EMPTY_URL_ERROR_MESSAGE = '링크가 첨부되지 않았습니다. 첨부 후 다시 클릭해주세요.';
const INVALID_URL_ERROR_MESSAGE = '유효하지 않은 링크입니다. 첨부 후 다시 클릭해주세요.';

function normalizeSpreadsheetUrl(input: string) {
  const trimmedInput = input.trim();

  if (!trimmedInput) return null;

  const urlInput = /^https?:\/\//i.test(trimmedInput) ? trimmedInput : `https://${trimmedInput}`;

  try {
    const url = new URL(urlInput);

    if (url.hostname !== 'docs.google.com') {
      return null;
    }

    if (!/^\/spreadsheets\/(?:u\/\d+\/)?d\/[a-zA-Z0-9-_]+(?:\/.*)?$/.test(url.pathname)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export default function useMemberSheetImport(clubId: number) {
  const navigate = useNavigate();
  const showApiErrorToast = useApiErrorToast();
  const { mutate: upsertClubSheet, isPending: isSubmitting } = useUpsertManagedClubSheetMutation(clubId);
  const { value: isOpen, setTrue: setOpen, setFalse: setClose } = useBooleanState(false);

  const [spreadsheetUrl, setSpreadsheetUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = () => {
    setSpreadsheetUrl('');
    setErrorMessage(null);
  };

  const open = () => {
    reset();
    setOpen();
  };

  const close = () => {
    if (isSubmitting) return;

    setClose();
    reset();
  };

  const handleChangeUrl = (value: string) => {
    setSpreadsheetUrl(value);

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    const normalizedSpreadsheetUrl = normalizeSpreadsheetUrl(spreadsheetUrl);

    if (!spreadsheetUrl.trim()) {
      setErrorMessage(EMPTY_URL_ERROR_MESSAGE);
      return;
    }

    if (!normalizedSpreadsheetUrl) {
      setErrorMessage(INVALID_URL_ERROR_MESSAGE);
      return;
    }

    upsertClubSheet(
      { spreadsheetUrl: normalizedSpreadsheetUrl },
      {
        onSuccess: () => {
          close();
          navigate(`/mypage/manager/${clubId}/members/sheet/preview`);
        },
        onError: (error) => {
          if (isApiError(error) && error.apiError) {
            setErrorMessage(getApiErrorMessage(error, INVALID_URL_ERROR_MESSAGE));
            return;
          }

          showApiErrorToast(error, '구글 시트 등록에 실패했습니다.');
        },
      }
    );
  };

  return {
    close,
    errorMessage,
    handleChangeUrl,
    handleSubmit,
    isOpen,
    isSubmitting,
    open,
    spreadsheetUrl,
  } as const;
}
