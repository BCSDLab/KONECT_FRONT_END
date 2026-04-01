import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { chatMutations } from '@/apis/chat/mutations';

export const useAdminChatMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    ...chatMutations.createAdminRoom(),
    onSuccess: ({ chatRoomId }) => {
      navigate(`/chats/${chatRoomId}`);
    },
  });
};
