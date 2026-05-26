import { Fragment } from 'react';
import { cn } from '@konect/utils/cn';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="text-text-400 flex items-center gap-3 text-sm leading-8 font-semibold sm:gap-3.5 sm:text-2xl sm:leading-10"
      aria-label="breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {item.to && !isLast ? (
              <Link className="hover:text-primary-600 transition-colors" to={item.to}>
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(isLast && 'text-text-600 min-w-0 truncate font-semibold')}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-text-300 text-lg sm:text-[20px]" aria-hidden="true">
                ›
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
