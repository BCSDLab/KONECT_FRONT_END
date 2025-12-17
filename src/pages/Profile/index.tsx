import { useGetMyInfo } from './hooks/useMyInfo';

const fields = [
  { label: '이름', name: 'name', disabled: false },
  { label: '학교명', name: 'universityName', disabled: true },
  { label: '학번', name: 'studentNumber', disabled: false },
  { label: '전화번호', name: 'phoneNumber', disabled: false },
] as const;

function Profile() {
  const { data: myInfo } = useGetMyInfo();

  return (
    <div className="flex flex-1 flex-col gap-2 bg-white px-5 py-6 pb-10">
      {fields.map(({ label, name, disabled }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
          <input
            name={name}
            value={myInfo?.[name] ?? ''}
            disabled={disabled}
            className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold disabled:text-indigo-200"
          />
        </div>
      ))}
      <button className="bg-primary text-indigo-5 mt-auto w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold">
        수정 완료
      </button>
    </div>
  );
}

export default Profile;
