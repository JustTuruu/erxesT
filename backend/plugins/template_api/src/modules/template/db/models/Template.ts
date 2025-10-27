import { Model } from 'mongoose';
import { IUserDocument } from 'erxes-api-shared/core-types';
import {
  ITemplate,
  ITemplateInput,
  TemplateDocument,
  templateSchema,
} from '../definitions/template';

type ITemplateDocument = Omit<
  ITemplate,
  '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'
>;

export interface ITemplateModel extends Model<TemplateDocument> {
  getTemplate(_id: string): Promise<TemplateDocument>;
  createTemplate(
    doc: ITemplateInput,
    user?: IUserDocument,
  ): Promise<TemplateDocument>;
  updateTemplate(
    _id: string,
    doc: Partial<ITemplateInput>,
    user?: IUserDocument,
  ): Promise<TemplateDocument>;
  removeTemplate(_id: string): Promise<TemplateDocument>;
}

export const loadTemplateClass = () => {
  class Template {
    public static async getTemplate(
      this: ITemplateModel,
      _id: string,
    ): Promise<TemplateDocument> {
      const template = await this.findOne({ _id });
      if (!template) {
        throw new Error('Template not found');
      }
      return template;
    }

    public static async createTemplate(
      this: ITemplateModel,
      doc: ITemplateInput,
      user?: IUserDocument,
    ): Promise<TemplateDocument> {
      const toCreate: Partial<ITemplate> = {
        ...doc,
        createdBy: user?._id,
      };

      return this.create(toCreate);
    }

    public static async updateTemplate(
      this: ITemplateModel,
      _id: string,
      doc: Partial<ITemplateInput>,
      user?: IUserDocument,
    ): Promise<TemplateDocument> {
      const template = await this.findOne({ _id });
      if (!template) throw new Error('Template not found');

      const updated = await this.findOneAndUpdate(
        { _id },
        {
          $set: {
            ...doc,
            updatedBy: user?._id,
            updatedAt: new Date(),
          },
        },
        { new: true },
      );

      if (!updated) throw new Error('Failed to update template');
      return updated;
    }

    public static async removeTemplate(
      this: ITemplateModel,
      _id: string,
    ): Promise<TemplateDocument> {
      const template = await this.findOne({ _id });
      if (!template) {
        throw new Error(`Template not found with id ${_id}`);
      }
      await this.deleteOne({ _id });
      return template;
    }
  }

  templateSchema.loadClass(Template);
  return templateSchema;
};
