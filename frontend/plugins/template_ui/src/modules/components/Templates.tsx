import React, { useState } from 'react';
import { ITemplateFilter } from '../types/types';
import TemplatesHeader from './TemplatesHeader';
import TemplatesList from './TemplatesList';
import TemplateForm from './TemplateForm';
import { useTemplates } from '../hooks/useTemplates';
import { PageContainer } from 'erxes-ui';

export const Templates: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [filter, setFilter] = useState<ITemplateFilter>({});
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { templates, totalCount, loading, error, refetch } = useTemplates({
    variables: {
      page,
      perPage,
      ...filter,
    },
  });

  const handleSearch = (searchValue: string) => {
    setFilter({ ...filter, searchValue });
    setPage(1);
  };

  return (
    <PageContainer>
      <TemplatesHeader
        onSearch={setFilter}
        onUpload={() => setShowUploadForm(true)}
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
      />
      {showUploadForm && (
        <TemplateForm
          onClose={() => setShowUploadForm(false)}
          onSuccess={refetch}
        />
      )}
    </PageContainer>
  );
};

export default Templates;
