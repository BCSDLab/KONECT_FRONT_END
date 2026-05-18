import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '@/contexts/useToastContext';
import { useCreateChatRoomMutation } from '@/pages/Chat/hooks/useChatMutations';
import {
  useApproveManagedApplicationMutation,
  useRejectManagedApplicationMutation,
} from '@/pages/Manager/hooks/useManagedApplicationMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';

export const useManagedApplicationActions = (clubId: number) => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();

  const { mutateAsync: createChatRoom, isPending: isCreatingChatRoom } = useCreateChatRoomMutation();
  const { mutate: approve, isPending: isApproving } = useApproveManagedApplicationMutation(clubId);
  const { mutate: reject, isPending: isRejecting } = useRejectManagedApplicationMutation(clubId);

  const isPending = isApproving || isRejecting || isCreatingChatRoom;

  const handleApprove = (e: MouseEvent<HTMLButtonElement>, applicationId: number) => {
    e.stopPropagation();
    approve(applicationId, {
      onSuccess: () => showToast('지원이 승인되었습니다'),
      onError: (error) => showApiErrorToast(error, '지원 승인 처리에 실패했습니다.'),
    });
  };

  const handleReject = (e: MouseEvent<HTMLButtonElement>, applicationId: number) => {
    e.stopPropagation();
    reject(applicationId, {
      onSuccess: () => showToast('지원이 거절되었습니다'),
      onError: (error) => showApiErrorToast(error, '지원 거절 처리에 실패했습니다.'),
    });
  };

  const handleDetail = (applicationId: number) => {
    navigate(`${applicationId}`);
  };

  const handleChat = async (e: MouseEvent<HTMLButtonElement>, userId: number) => {
    e.stopPropagation();
    const response = await createChatRoom(userId);
    navigate(`/chats/${response.chatRoomId}`);
  };

  return { isPending, handleApprove, handleReject, handleDetail, handleChat };
};
