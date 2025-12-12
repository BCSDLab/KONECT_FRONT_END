import type { ComponentType } from 'react';

type AgreementRowProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  RightIcon?: ComponentType<React.SVGAttributes<SVGElement>>;
  CheckIcon: ComponentType<React.SVGAttributes<SVGElement>>;
};

function AgreementRow({ checked, onChange, label, RightIcon, CheckIcon }: AgreementRowProps) {
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
        <span className="text-sm font-medium text-indigo-100 peer-checked:text-black">{label}</span>
      </label>

      {RightIcon ? <RightIcon className="text-indigo-100" /> : null}
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
      <span className="font-semibold text-indigo-100 peer-checked:text-black">{label}</span>
    </label>
  );
}

export { AgreementRow, AgreementAllRow };
