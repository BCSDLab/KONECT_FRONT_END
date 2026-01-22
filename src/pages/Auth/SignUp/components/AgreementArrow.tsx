import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

type AgreementRowProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  route: string;
  RightIcon?: ComponentType<React.SVGAttributes<SVGElement>>;
  CheckIcon: ComponentType<React.SVGAttributes<SVGElement>>;
};

function AgreementRow({ checked, onChange, label, route, RightIcon, CheckIcon }: AgreementRowProps) {
  return (
    <div className="flex justify-between">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <CheckIcon className="text-indigo-100 peer-checked:text-black" />
        <span className="text-sub2 text-indigo-100 peer-checked:text-black">{label}</span>
      </label>

      {RightIcon ? (
        <Link to={route}>
          <RightIcon className="text-indigo-100" />
        </Link>
      ) : null}
    </div>
  );
}

type AgreementAllRowProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  BigCheckIcon: ComponentType<React.SVGAttributes<SVGElement>>;
};

function AgreementAllRow({ checked, onChange, label, BigCheckIcon }: AgreementAllRowProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <BigCheckIcon className="text-indigo-100 peer-checked:text-black" />
      <span className="text-h3 text-indigo-100 peer-checked:text-black">{label}</span>
    </label>
  );
}

export { AgreementRow, AgreementAllRow };
