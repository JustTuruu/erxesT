import { useState, useEffect } from 'react';
import {
  Sheet,
  Input,
  Label,
  Select,
  Textarea,
  Button,
  Spinner,
} from 'erxes-ui';

interface SaveAsTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    status?: string;
  }) => void;
  loading?: boolean;
  title?: string;
  entityName?: string; // "board", "pipeline", etc.
}

export const SaveAsTemplateForm = ({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
  title = 'Save as Template',
  entityName = 'item',
}: SaveAsTemplateFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setStatus('active');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      status,
    });
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setStatus('active');
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <Sheet.View
        className="p-0"
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-0 w-full h-full"
        >
          <Sheet.Header>
            <Sheet.Title className="text-lg text-foreground">
              {title}
            </Sheet.Title>
            <Sheet.Close />
          </Sheet.Header>
          <Sheet.Content className="grow size-full h-auto flex flex-col px-5 py-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter template name for ${entityName}`}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Textarea
                id="template-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter template description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-status">Status</Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={loading}
              >
                <Select.Trigger id="template-status">
                  <Select.Value placeholder="Select status" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="active">Active</Select.Item>
                  <Select.Item value="inactive">Inactive</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </Sheet.Content>
          <Sheet.Footer>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? <Spinner /> : 'Save as Template'}
            </Button>
          </Sheet.Footer>
        </form>
      </Sheet.View>
    </Sheet>
  );
};
