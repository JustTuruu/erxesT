import { IOrderInput } from 'erxes-api-shared/core-types';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  IPipeline,
  IPipelineDocument,
  IStageDocument,
} from '~/modules/sales/@types';
import { checkNumberConfig } from '~/modules/sales/utils';

export const pipelineMutations = {
  /**
   * Create new pipeline
   */
  async salesPipelinesAdd(
    _root,
    { stages, ...doc }: IPipeline & { stages: IStageDocument[] },
    { user, models }: IContext,
  ) {
    if (doc.numberConfig || doc.numberSize) {
      await checkNumberConfig(doc.numberConfig || '', doc.numberSize || '');
    }

    // await sendCoreMessage({
    //   subdomain,
    //   action: "registerOnboardHistory",
    //   data: {
    //     type: `${doc.type}PipelineConfigured`,
    //     user
    //   }
    // });

    return await models.Pipelines.createPipeline(
      { userId: user._id, ...doc },
      stages,
    );
  },

  /**
   * Edit pipeline
   */
  async salesPipelinesEdit(
    _root,
    { _id, stages, ...doc }: IPipelineDocument & { stages: IStageDocument[] },
    { models }: IContext,
  ) {
    if (doc.numberConfig || doc.numberSize) {
      await checkNumberConfig(doc.numberConfig || '', doc.numberSize || '');
    }

    return await models.Pipelines.updatePipeline(_id, doc, stages);
  },

  /**
   * Update pipeline orders
   */
  async salesPipelinesUpdateOrder(
    _root,
    { orders }: { orders: IOrderInput[] },
    { models }: IContext,
  ) {
    return models.Pipelines.updateOrder(orders);
  },

  /**
   * Watch pipeline
   */
  async salesPipelinesWatch(
    _root,
    { _id, isAdd }: { _id: string; isAdd: boolean },
    { user, models }: IContext,
  ) {
    return models.Pipelines.watchPipeline(_id, isAdd, user._id);
  },

  /**
   * Remove pipeline
   */
  async salesPipelinesRemove(
    _root,
    { _id }: { _id: string },
    { models, subdomain }: IContext,
  ) {
    const pipeline = await models.Pipelines.getPipeline(_id);

    const relatedFieldsGroups = await sendTRPCMessage({
      subdomain,

      pluginName: 'core',
      method: 'query',
      module: 'fieldsGroups',
      action: 'find',
      input: {
        query: {
          pipelineIds: pipeline._id,
        },
      },
      defaultValue: [],
    });

    for (const fieldGroup of relatedFieldsGroups) {
      const pipelineIds = fieldGroup.pipelineIds || [];
      fieldGroup.pipelineIds = pipelineIds.filter((e) => e !== pipeline._id);

      await sendTRPCMessage({
        subdomain,

        pluginName: 'core',
        method: 'mutation',
        module: 'fieldsGroups', // ??
        action: 'updateGroup',
        input: {
          groupId: fieldGroup._id,
          fieldGroup,
        },
      });
    }

    return await models.Pipelines.removePipeline(_id);
  },

  /**
   * Archive pipeline
   */
  async salesPipelinesArchive(
    _root,
    { _id, status }: { _id: string; status: string },
    { models }: IContext,
  ) {
    return await models.Pipelines.archivePipeline(_id, status);
  },

  /**
   * Duplicate pipeline
   */
  async salesPipelinesCopied(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const sourcePipeline = await models.Pipelines.getPipeline(_id);
    const sourceStages = await models.Stages.find({ pipelineId: _id }).lean();

    const pipelineDoc = {
      ...sourcePipeline,
      _id: undefined,
      status: sourcePipeline.status || 'active',
      name: `${sourcePipeline.name}-copied`,
    };

    const copied = await models.Pipelines.createPipeline(pipelineDoc);

    for (const stage of sourceStages) {
      const { _id, ...rest } = stage;

      await models.Stages.createStage({
        ...rest,
        probability: stage.probability || '10%',
        pipelineId: copied._id,
      });
    }

    return copied;
  },

  /**
   * Save pipeline as template - saves only the specific pipeline as template
   */
  async salesPipelineSaveAsTemplate(
    _root,
    {
      _id,
      name,
      description,
      status,
    }: { _id: string; name: string; description?: string; status?: string },
    { models, subdomain, user }: IContext,
  ) {
    const pipeline = await models.Pipelines.getPipeline(_id);

    // Get all stages for this pipeline
    const stages = await models.Stages.find({ pipelineId: _id }).lean();

    // Create template content
    const templateContent = {
      pipeline: {
        name: pipeline.name,
        visibility: pipeline.visibility,
        bgColor: pipeline.bgColor,
        startDate: pipeline.startDate,
        endDate: pipeline.endDate,
        metric: pipeline.metric,
        hackScoringType: pipeline.hackScoringType,
        isCheckDate: pipeline.isCheckDate,
        isCheckUser: pipeline.isCheckUser,
        isCheckDepartment: pipeline.isCheckDepartment,
        numberConfig: pipeline.numberConfig,
        numberSize: pipeline.numberSize,
        nameConfig: pipeline.nameConfig,
        stages: stages.map((stage: IStageDocument) => ({
          name: stage.name,
          probability: stage.probability,
          status: stage.status,
          order: stage.order,
        })),
      },
    };

    // Save to template_api via TRPC
    const template = await sendTRPCMessage({
      subdomain,
      pluginName: 'template',
      method: 'mutation',
      module: 'templates',
      action: 'add',
      input: {
        doc: {
          name,
          content: JSON.stringify(templateContent),
          contentType: 'sales-pipeline',
          pluginType: 'sales',
          description:
            description || `Template created from pipeline: ${pipeline.name}`,
          status: status || 'active',
        },
      },
    });

    return {
      success: true,
      templateId: template._id,
      message: 'Pipeline saved as template successfully',
    };
  },
};
