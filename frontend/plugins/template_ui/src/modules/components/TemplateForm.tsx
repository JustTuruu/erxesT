import React, { useState } from 'react';
import { Button, Input, Label, Textarea } from 'erxes-ui';
import { IconX } from '@tabler/icons-react';
import { ITemplate, ITemplateInput } from '../types/types';
import { useTemplateTypes, useCategories } from '../hooks/useTemplates';
import { useTemplateAdd } from '../hooks/useTemplateAdd';
import { useTemplateEdit } from '../hooks/useTemplateEdit';
interface IProps {
  template?: ITemplate;
  onClose: () => void;
  onSuccess: () => void;
}

const TemplateForm: React.FC<IProps> = ({ template, onClose, onSuccess }) => {
  const isEdit = !!template;

  const [formData, setFormData] = useState<ITemplateInput>({
    name: template?.name || '',
    content: template?.content || '',
    contentType: template?.contentType || '',
    description: template?.description || '',
    pluginType: template?.pluginType || '',
    categoryIds: template?.categoryIds || [],
    status: template?.status || 'active',
  });

  const { types: contentTypes } = useTemplateTypes();

  const { categories } = useCategories({
    variables: { type: formData.contentType },
    skip: !formData.contentType,
  });

  const { addTemplate, loading: addLoading } = useTemplateAdd({
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  const { editTemplate, loading: editLoading } = useTemplateEdit({
    onCompleted: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.contentType) {
      alert('Please fill in required fields: Name and Content Type');
      return;
    }

    const input: ITemplateInput = {
      ...formData,
      categoryIds: formData.categoryIds?.length
        ? formData.categoryIds
        : undefined,
      pluginType: formData.pluginType || undefined,
      description: formData.description || undefined,
      content: formData.content || undefined,
    };

    if (isEdit && template) {
      editTemplate({
        variables: {
          _id: template._id,
          input,
        },
      });
    } else {
      addTemplate({
        variables: { input },
      });
    }
  };

  const handleChange = (field: keyof ITemplateInput, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const loading = addLoading || editLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Edit Template' : 'Add New Template'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <IconX size={20} />
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter template name"
                required
              />
            </div>

            {/* Content Type */}
            <div>
              <Label htmlFor="contentType">
                Content Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="contentType"
                value={formData.contentType}
                onChange={(e) => handleChange('contentType', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select content type</option>
                {contentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Plugin Type */}
            <div>
              <Label htmlFor="pluginType">Plugin Type</Label>
              <Input
                id="pluginType"
                value={formData.pluginType || ''}
                onChange={(e) => handleChange('pluginType', e.target.value)}
                placeholder="e.g., sales, content, etc."
              />
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <Label htmlFor="categoryIds">Categories</Label>
                <select
                  id="categoryIds"
                  multiple
                  value={formData.categoryIds || []}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option: any) => option.value,
                    );
                    handleChange('categoryIds', selected);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Hold Ctrl/Cmd to select multiple categories
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter template description"
                rows={3}
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter template content"
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status || 'active'}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
