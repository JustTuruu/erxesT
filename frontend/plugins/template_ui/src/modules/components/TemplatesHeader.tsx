import React from 'react';
import { Button } from 'erxes-ui';
import { IconRefresh, IconPlus } from '@tabler/icons-react';

interface IProps {
  onRefresh: () => void;
  onSearch?: (value: string) => void;
  onAddTemplate: () => void;
}

const TemplatesHeader: React.FC<IProps> = ({
  onRefresh,
  onSearch,
  onAddTemplate,
}) => {
  console.log('TemplatesHeader rendered', { onAddTemplate });

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Templates</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <IconRefresh size={16} />
          Refresh
        </Button>
        <Button
          size="sm"
          onClick={() => {
            console.log('Add Template clicked!');
            onAddTemplate();
          }}
        >
          <IconPlus size={16} />
          Add Template
        </Button>
      </div>
    </div>
  );
};

export default TemplatesHeader;
