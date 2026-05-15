import { useState } from 'react';

import { useToastContext } from '@/contexts/useToastContext';
import { useAddManagedPreMemberMutation } from '@/pages/Manager/hooks/useManagedMemberMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';

export default function useAddMember(clubId: number) {
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();

  const { mutate: addPreMember, isPending: isAdding } = useAddManagedPreMemberMutation(clubId);

  const { value: isOpen, setTrue: open, setFalse: close } = useBooleanState();
  const [studentNumber, setStudentNumber] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!studentNumber || !name) return;
    addPreMember(
      { studentNumber, name },
      {
        onSuccess: () => showToast('부원이 추가되었습니다'),
        onError: (error) => showApiErrorToast(error, '부원 추가에 실패했습니다.'),
      }
    );
    close();
    setStudentNumber('');
    setName('');
  };

  return {
    isOpen,
    isAdding,
    studentNumber,
    name,
    setStudentNumber,
    setName,
    open,
    close,
    handleSubmit,
  } as const;
}
