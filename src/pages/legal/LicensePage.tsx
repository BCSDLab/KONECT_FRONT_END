import { licenses } from '@/constants/licenses';

function LicensePage() {
  return (
    <div className="bg-indigo-0 py-3">
      <div className="space-x-[-0.2px] px-4 text-[20px] leading-[30px] font-semibold">오픈소스 라이선스</div>
      {licenses.map(({ name, url, license }) => (
        <div key={name} className="px-6 py-3">
          <div className="text-[15px] leading-6 font-medium">
            * {name} ({license})
          </div>
          <a
            href={url}
            className="text-sm leading-5 font-extralight text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {url}
          </a>
        </div>
      ))}
    </div>
  );
}

export default LicensePage;
