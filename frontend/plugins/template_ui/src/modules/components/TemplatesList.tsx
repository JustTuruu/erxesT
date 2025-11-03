import React from 'react';
import { ApolloError } from '@apollo/client';
import { ITemplate } from '../types/types';
import TemplateRow from './TemplateRow';

interface IProps {
  templates: ITemplate[];
  loading: boolean;
  error?: ApolloError;
  totalCount: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onRefetch: () => void;
  onEdit: (template: ITemplate) => void;
}

const TemplatesList: React.FC<IProps> = ({
  templates,
  loading,
  error,
  totalCount,
  onRefetch,
  onEdit,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading templates...</p>
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
        <p>No templates found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Description
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {templates.map((template) => (
            <TemplateRow
              key={template._id}
              template={template}
              onRefetch={onRefetch}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t">
        <p className="text-sm text-gray-500">Total: {totalCount} templates</p>
      </div>
    </div>
  );
};

export default TemplatesList;
