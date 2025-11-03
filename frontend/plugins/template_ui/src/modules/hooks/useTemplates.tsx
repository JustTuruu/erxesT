import {
  useMutation,
  useQuery,
  MutationHookOptions,
  QueryHookOptions,
} from '@apollo/client';
import { toast } from 'erxes-ui';
import {
  TEMPLATE_LIST,
  TEMPLATE_DETAIL,
  TEMPLATES_GET_TYPES,
  CATEGORY_LIST,
} from '../graphql/queries';
import {
  ADD_TEMPLATE,
  EDIT_TEMPLATE,
  REMOVE_TEMPLATE,
  USE_TEMPLATE,
} from '../graphql/mutations';
import {
  ITemplate,
  ITemplateListResponse,
  ITemplateDetailResponse,
  ITemplatesGetTypesResponse,
  ICategoryListResponse,
} from '../types/types';

// Query hooks
export const useTemplates = (
  options?: QueryHookOptions<ITemplateListResponse>,
) => {
  const { data, loading, error, refetch, fetchMore } =
    useQuery<ITemplateListResponse>(TEMPLATE_LIST, {
      ...options,
      fetchPolicy: 'cache-and-network',
      onError: (e) => {
        toast({
          title: 'Error',
          description: e.message,
          variant: 'destructive',
        });
      },
    });

  const templates = data?.templateList?.list || [];
  const totalCount = data?.templateList?.totalCount || 0;

  return {
    templates,
    totalCount,
    loading,
    error,
    refetch,
    fetchMore,
  };
};

export const useTemplateDetail = (
  options?: QueryHookOptions<ITemplateDetailResponse>,
) => {
  const { data, loading, error } = useQuery<ITemplateDetailResponse>(
    TEMPLATE_DETAIL,
    {
      ...options,
      skip: !options?.variables?._id,
    },
  );

  return {
    template: data?.templateDetail,
    loading,
    error,
  };
};

export const useTemplateTypes = () => {
  const { data, loading, error } =
    useQuery<ITemplatesGetTypesResponse>(TEMPLATES_GET_TYPES);

  return {
    types: data?.templatesGetTypes || [],
    loading,
    error,
  };
};

export const useCategories = (
  options?: QueryHookOptions<ICategoryListResponse>,
) => {
  const { data, loading, error } = useQuery<ICategoryListResponse>(
    CATEGORY_LIST,
    {
      ...options,
    },
  );

  return {
    categories: data?.categoryList?.list || [],
    totalCount: data?.categoryList?.totalCount || 0,
    loading,
    error,
  };
};

// Mutation hooks
