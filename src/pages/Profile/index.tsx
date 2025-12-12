const fields = [
  { label: '이름', name: 'name' },
  { label: '학교명', name: 'school' },
  { label: '학번', name: 'studentId' },
  { label: '전화번호', name: 'phone' },
];

function Profile() {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-white px-5 py-6 pb-10">
      {fields.map(({ label, name }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
          <input name={name} className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold" />
        </div>
      ))}
      <button className="bg-primary text-indigo-5 mt-auto w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold">
        수정 완료
      </button>
    </div>
  );
}

export default Profile;
