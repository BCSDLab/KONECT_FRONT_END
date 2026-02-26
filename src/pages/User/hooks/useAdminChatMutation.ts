import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postAdminChatRoom } from '@/apis/chat';

export const useAdminChatMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: postAdminChatRoom,
    onSuccess: ({ chatRoomId }) => {
      navigate(`/chats/${chatRoomId}`);
    },
  });
};
