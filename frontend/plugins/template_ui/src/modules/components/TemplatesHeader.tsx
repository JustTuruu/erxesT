import React from 'react';
import { Button } from 'erxes-ui';
import { IconUpload } from '@tabler/icons-react';

interface IProps {
  onSearch?: (value: string) => void;
  onUpload: () => void;
}

const TemplatesHeader: React.FC<IProps> = ({ onUpload }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-sidebar">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Templates</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onUpload}>
          <IconUpload size={16} />
          Upload Template
        </Button>
      </div>
    </div>
  );
};

export default TemplatesHeader;
