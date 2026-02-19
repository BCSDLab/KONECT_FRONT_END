import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import CircleHelpIcon from '@/assets/svg/circle-help.svg';
import ColorLegendModal from './ColorLegendModal';

function ScheduleHeader() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    navigate('/home', { replace: true });
  };

  const handleHelpClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="fixed z-30 flex h-11 w-full justify-between bg-white px-4 py-2">
        <button type="button" aria-label="뒤로가기" onClick={handleBack}>
          <ChevronLeftIcon />
        </button>
        <button type="button" aria-label="help" onClick={handleHelpClick}>
          <CircleHelpIcon />
        </button>
      </header>

      <ColorLegendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default ScheduleHeader;
