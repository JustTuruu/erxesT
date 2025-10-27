import { IContext } from '../../../../../connectionResolvers';
import { ITemplateInput } from '../../../db/definitions/template';
import { sendTRPCMessage, getSubdomain } from 'erxes-api-shared/utils';

export const templateMutations = {
  templateAdd: async (
    _parent: undefined,
    { doc }: { doc: ITemplateInput },
    { models, user }: IContext,
  ) => {
    return models.Template.createTemplate(doc, user);
  },

  templateEdit: async (
    _parent: undefined,
    { _id, doc }: { _id: string; doc: Partial<ITemplateInput> },
    { models, user }: IContext,
  ) => {
    return models.Template.updateTemplate(_id, doc, user);
  },

  templateRemove: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.Template.removeTemplate(_id);
  },

  templateUse: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, req, user }: IContext,
  ) => {
    const subdomain = getSubdomain(req);
    const template = await models.Template.getTemplate(_id);

    if (!template) {
      throw new Error('Template not found');
    }

    const type = template.contentType as string | undefined;
    const [serviceName, contentType] = (type || '').split(':');

    if (!serviceName || !contentType) {
      throw new Error(
        'Invalid or missing contentType on template. Expected format "plugin:resource"',
      );
    }

    const result = await sendTRPCMessage({
      pluginName: serviceName,
      method: 'mutation',
      module: 'templates',
      action: 'useTemplate',
      input: {
        template,
        contentType,
        currentUser: user,
        subdomain,
      },
      defaultValue: null,
    });

    return result;
  },
};
