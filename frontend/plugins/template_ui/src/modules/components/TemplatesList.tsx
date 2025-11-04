import React from 'react';
import { ApolloError } from '@apollo/client';
import { ITemplate } from '../types/types';
import TemplateActions from './TemplateActions';

interface IProps {
  templates: ITemplate[];
  loading: boolean;
  error?: ApolloError;
  totalCount: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
}

const TemplatesList: React.FC<IProps> = ({
  templates,
  loading,
  error,
  totalCount,
  page,
  perPage,
  onPageChange,
  onRefetch,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No templates found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6 bg-sidebar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template._id}
            className="bg-card rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-4 border-b">
              <h3 className="font-semibold truncate">{template.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {template.contentType}
                </span>
                {template.pluginType && (
                  <>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {template.pluginType}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[100px] bg-muted/50">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {template.description || 'No description'}
              </p>
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex items-center justify-between">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  template.status === 'active'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {template.status || 'active'}
              </span>
              <TemplateActions template={template} onRefetch={onRefetch} />
            </div>
          </div>
        ))}
      </div>

      {totalCount > perPage && (
        <div className="mt-6 bg-card px-4 py-3 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * perPage + 1} to{' '}
              {Math.min(page * perPage, totalCount)} of {totalCount} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 text-sm border rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page * perPage >= totalCount}
                className="px-3 py-1 text-sm border rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesList;
