export interface ITemplate {
  _id: string;
  name: string;
  content?: string;
  contentType: string;
  description?: string;
  pluginType?: string;
  categoryIds?: string[];
  status?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITemplateInput {
  name: string;
  content?: string;
  contentType: string;
  description?: string;
  pluginType?: string;
  categoryIds?: string[];
  status?: string;
}

export interface ITemplateCategory {
  _id: string;
  name: string;
  parentId?: string;
  order?: number;
  code?: string;
  contentType?: string;
  templateCount?: number;
  isRoot?: boolean;
}

export interface ITemplateListResponse {
  templateList: {
    list: ITemplate[];
    totalCount: number;
  };
}

export interface ITemplateDetailResponse {
  templateDetail: ITemplate;
}

export interface ICategoryListResponse {
  categoryList: {
    list: ITemplateCategory[];
    totalCount: number;
  };
}

export interface ITemplatesGetTypesResponse {
  templatesGetTypes: string[];
}

export interface ITemplateFilter {
  searchValue?: string;
  status?: string;
  categoryIds?: string[];
  contentType?: string;
}
