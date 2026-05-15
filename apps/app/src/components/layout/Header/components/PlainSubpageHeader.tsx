import type { Ref } from 'react';
import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface PlainSubpageHeaderProps {
  title: string;
  headerRef?: Ref<HTMLElement>;
}

function PlainSubpageHeader({ title, headerRef }: PlainSubpageHeaderProps) {
  return <BackTitleHeader title={title} headerRef={headerRef} headerClassName="px-4 py-2" />;
}

export default PlainSubpageHeader;
