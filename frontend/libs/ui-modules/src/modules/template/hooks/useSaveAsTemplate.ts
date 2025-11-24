import { gql, useMutation } from '@apollo/client';

const TEMPLATE_SAVE_FROM = gql`
  mutation TemplateSaveFrom(
    $sourceId: String!
    $contentType: String!
    $name: String!
    $description: String
    $status: String
  ) {
    templateSaveFrom(
      sourceId: $sourceId
      contentType: $contentType
      name: $name
      description: $description
      status: $status
    )
  }
`;

export interface UseSaveAsTemplateOptions {
  contentType: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useSaveAsTemplate = ({
  contentType,
  onSuccess,
  onError,
}: UseSaveAsTemplateOptions) => {
  const [saveAsTemplate, { loading, error }] = useMutation(TEMPLATE_SAVE_FROM, {
    onCompleted: (data) => {
      onSuccess?.(data.templateSaveFrom);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const handleSave = (
    input: { name: string; description?: string; status?: string },
    sourceId: string,
  ) => {
    return saveAsTemplate({
      variables: {
        sourceId,
        contentType,
        ...input,
      },
    });
  };

  return {
    saveAsTemplate: handleSave,
    loading,
    error,
  };
};
