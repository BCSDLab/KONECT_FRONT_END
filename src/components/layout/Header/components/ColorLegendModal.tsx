interface ColorLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ColorLegendModal({ isOpen, onClose }: ColorLegendModalProps) {
  if (!isOpen) return null;

  const colorLegends = [
    { name: '총동아리', color: '#E9F2FA' },
    { name: '동아리', color: '#FDE49B' },
    { name: '학사일정', color: '#AEDCBA' },
    { name: '공휴일', color: '#FFB8B8' },
    { name: '기숙사', color: '#B9ADEF' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-xs rounded-xl bg-white p-5 shadow-lg">
        <h2 className="mb-5 text-center text-lg font-bold text-gray-800">일정 색상</h2>

        <div className="space-y-3">
          {colorLegends.map((legend) => (
            <div key={legend.name} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded" style={{ backgroundColor: legend.color }} />
              <span className="text-sm font-medium text-gray-700">{legend.name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default ColorLegendModal;
