import { useState } from 'react';
import Modal from '@/components/common/Modal';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useWithdrawMutation } from '../MyPage/hooks/useWithdraw';
import { useMyInfo } from './hooks/useMyInfo';

const fields = [
  { label: '학교명', name: 'universityName', disabled: true },
  { label: '이메일', name: 'email', disabled: true },
  { label: '이름', name: 'name', disabled: false },
  { label: '학번', name: 'studentNumber', disabled: false },
  { label: '전화번호', name: 'phoneNumber', disabled: false },
] as const;

function Profile() {
  const { myInfo, modifyMyInfo, error } = useMyInfo();
  const { mutate: withdraw } = useWithdrawMutation();

  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);

  const [form, setForm] = useState(() => ({
    name: myInfo?.name ?? '',
    studentNumber: myInfo?.studentNumber ?? '',
    phoneNumber: myInfo?.phoneNumber ?? '',
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    modifyMyInfo(form);
  };

  return (
    <div className="flex flex-1 flex-col gap-2 bg-white px-5 py-6 pb-10">
      {fields.map(({ label, name, disabled }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
          <input
            name={name}
            value={disabled ? (myInfo?.[name] ?? '') : form[name]}
            disabled={disabled}
            onChange={handleChange}
            className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold disabled:text-indigo-200"
          />
        </div>
      ))}
      <div className="text-[10px] leading-3 font-medium text-indigo-300">
        <button type="button" onClick={openModal} className="text-[#3182f6]">
          탈퇴
        </button>
        <span>를 원하시나요?</span>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error.apiError?.fieldErrors?.length ? (
            error.apiError.fieldErrors.map((fieldError, index) => <p key={index}>{fieldError.message}</p>)
          ) : (
            <p>{error.message ?? '정보 수정에 실패했습니다.'}</p>
          )}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-primary text-indigo-5 mt-auto w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold"
      >
        수정 완료
      </button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col gap-5 p-5">
          <div className="text-lg leading-8 font-bold whitespace-pre-wrap">
            정말로 탈퇴하시겠어요?{'\n'}탈퇴 후 코넥트의 기능을 사용할 수 없어요
          </div>
          <div className="flex justify-between gap-3">
            <button
              onClick={closeModal}
              className="bg-indigo-25 w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold text-indigo-400"
            >
              취소
            </button>
            <button
              onClick={() => withdraw()}
              className="w-full rounded-lg bg-indigo-700 py-3.5 text-center text-lg leading-7 font-bold text-white"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
