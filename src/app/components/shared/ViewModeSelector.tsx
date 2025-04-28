import { LayoutGrid, List } from 'lucide-react';
import { useTheme } from '@mui/material';

type ViewMode = 'grid' | 'list';

type ViewModeSelectorProps = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
}: ViewModeSelectorProps) {
  const theme = useTheme();

  return (
    <div
      className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1"
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? '#2D2925' : 'white',
      }}
    >
      <button
        onClick={() => onViewModeChange('grid')}
        className={`p-2 rounded-lg ${
          viewMode === 'grid'
            ? 'bg-kai-primary text-white'
            : 'text-neutral-800 hover:bg-neutral-100'
        }`}
      >
        <LayoutGrid size={20} />
      </button>
      <button
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded-lg ${
          viewMode === 'list'
            ? 'bg-kai-primary text-white'
            : 'text-neutral-800 hover:bg-neutral-100'
        }`}
      >
        <List size={20} />
      </button>
    </div>
  );
}
