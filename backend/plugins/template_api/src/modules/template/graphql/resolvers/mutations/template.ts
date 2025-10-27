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
    const template = await models.Template.getTemplate(_id);

    if (!template) {
      throw new Error('Template not found');
    }

    const type = template.contentType as string | undefined;

    // If no contentType or invalid format, just return the template
    if (!type || !type.includes(':')) {
      return {
        _id: template._id,
        name: template.name,
        content: template.content,
        contentType: template.contentType,
      };
    }

    const subdomain = getSubdomain(req);
    const [serviceName, contentType] = type.split(':');

    if (!serviceName || !contentType) {
      return {
        _id: template._id,
        name: template.name,
        content: template.content,
        contentType: template.contentType,
      };
    }

    // Try to send TRPC message, fallback to template if fails
    try {
      const result = await sendTRPCMessage({
        subdomain,
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

      return result || template;
    } catch (error) {
      // If TRPC fails, just return the template
      return {
        _id: template._id,
        name: template.name,
        content: template.content,
        contentType: template.contentType,
      };
    }
  },
};
