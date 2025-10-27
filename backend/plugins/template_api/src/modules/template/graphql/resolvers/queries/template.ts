import { IContext } from '../../../../../connectionResolvers';

export const templateQueries = {
  templatesGetTypes: async (
    _parent: undefined,
    _args: any,
    { models }: IContext,
  ) => {
    // Return distinct contentTypes as JSON array
    const types = await models.Template.distinct('contentType');
    return types.map((type) => ({ value: type, label: type }));
  },

  templateList: async (
    _parent: undefined,
    {
      searchValue,
      categoryIds,
      page = 1,
      perPage = 20,
      contentType,
    }: {
      searchValue?: string;
      categoryIds?: string[];
      page?: number;
      perPage?: number;
      contentType?: string;
    },
    { models }: IContext,
  ) => {
    const filter: any = { status: { $ne: 'inactive' } };

    if (searchValue) {
      filter.$or = [
        { name: { $regex: searchValue, $options: 'i' } },
        { description: { $regex: searchValue, $options: 'i' } },
      ];
    }

    if (categoryIds && categoryIds.length > 0) {
      filter.category = { $in: categoryIds };
    }

    if (contentType) {
      filter.contentType = contentType;
    }

    const totalCount = await models.Template.countDocuments(filter);
    const skip = (page - 1) * perPage;

    const list = await models.Template.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();

    return {
      list,
      totalCount,
      pageInfo: {
        hasNextPage: skip + perPage < totalCount,
        hasPreviousPage: page > 1,
        startCursor: null,
        endCursor: null,
      },
    };
  },

  templateDetail: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Template.getTemplate(_id);
  },

  categoryList: async (
    _parent: undefined,
    { type }: { type?: string },
    { models }: IContext,
  ) => {
    const filter: any = { status: { $ne: 'inactive' } };

    if (type) {
      filter.contentType = type;
    }

    const totalCount = await models.TemplateCategory.countDocuments(filter);
    const list = await models.TemplateCategory.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return {
      list,
      totalCount,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  },
};
