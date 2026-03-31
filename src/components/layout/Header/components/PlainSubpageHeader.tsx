import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface PlainSubpageHeaderProps {
  title: string;
}

function PlainSubpageHeader({ title }: PlainSubpageHeaderProps) {
  return <BackTitleHeader title={title} headerClassName="px-4 py-2" />;
}

export default PlainSubpageHeader;
