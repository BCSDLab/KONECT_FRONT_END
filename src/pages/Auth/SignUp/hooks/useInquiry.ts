import { useMutation } from '@tanstack/react-query';
import { postInquiry } from '@/apis/inquiry';

export const useInquiryMutation = () => {
  const mutation = useMutation({
    mutationFn: postInquiry,
  });

  return {
    ...mutation,
  };
};
