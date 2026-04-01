import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';

interface AgreementLinkState {
  backPath?: string;
}

type AgreementRowProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  route: string;
  state?: AgreementLinkState;
  RightIcon?: ComponentType<React.SVGAttributes<SVGElement>>;
  CheckIcon: ComponentType<React.SVGAttributes<SVGElement>>;
};

function AgreementRow({ checked, onChange, label, route, state, RightIcon, CheckIcon }: AgreementRowProps) {
  return (
    <div className="flex justify-between">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <CheckIcon className="peer-checked:text-primary-600 text-indigo-100" />
        <span className="text-sub2 peer-checked:text-primary-600 text-indigo-100">{label}</span>
      </label>

      {RightIcon ? (
        <Link to={route} state={state} aria-label={`${label} 보기`}>
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
      <BigCheckIcon className="peer-checked:text-primary-600 text-indigo-100" />
      <span className="text-h3 peer-checked:text-primary-600 text-indigo-100">{label}</span>
    </label>
  );
}

export { AgreementRow, AgreementAllRow };
