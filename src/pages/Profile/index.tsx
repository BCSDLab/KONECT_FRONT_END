import { useState } from 'react';
import { useMyInfo } from './hooks/useMyInfo';

const fields = [
  { label: '이름', name: 'name', disabled: false },
  { label: '학교명', name: 'universityName', disabled: true },
  { label: '학번', name: 'studentNumber', disabled: false },
  { label: '전화번호', name: 'phoneNumber', disabled: false },
] as const;

function Profile() {
  const { myInfo, modifyMyInfo, error } = useMyInfo();
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
    </div>
  );
}

export default Profile;
