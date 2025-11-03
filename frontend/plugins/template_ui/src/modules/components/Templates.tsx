import React, { useState } from 'react';
import { ITemplateFilter, ITemplate } from '../types/types';
import TemplatesHeader from './TemplatesHeader';
import TemplatesList from './TemplatesList';
import TemplateForm from './TemplateForm';
import { useTemplates } from '../hooks/useTemplates';

export const Templates: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [filter, setFilter] = useState<ITemplateFilter>({});
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    ITemplate | undefined
  >();

  console.log('Templates component rendered', { showForm, editingTemplate });

  const { templates, totalCount, loading, error, refetch } = useTemplates({
    variables: {
      page,
      perPage,
      ...filter,
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSearch = (searchValue: string) => {
    setFilter({ ...filter, searchValue });
    setPage(1);
  };

  const handleFilterChange = (newFilter: Partial<ITemplateFilter>) => {
    setFilter({ ...filter, ...newFilter });
    setPage(1);
  };

  const handleAddTemplate = () => {
    setEditingTemplate(undefined);
    setShowForm(true);
  };

  const handleEditTemplate = (template: ITemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTemplate(undefined);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      <TemplatesHeader
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        onAddTemplate={handleAddTemplate}
      />
      <TemplatesList
        templates={templates}
        loading={loading}
        error={error}
        totalCount={totalCount}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onRefetch={refetch}
        onEdit={handleEditTemplate}
      />
      {showForm && (
        <TemplateForm
          template={editingTemplate}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Templates;
