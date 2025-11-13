import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { IBoard, IBoardDocument } from '~/modules/sales/@types';
import { IPipelineDocument, IStageDocument } from '~/modules/sales/@types';

export const boardMutations = {
  /**
   * Create new board
   */
  async salesBoardsAdd(_root, doc: IBoard, { user, models }: IContext) {
    return await models.Boards.createBoard({ userId: user._id, ...doc });
  },

  /**
   * Edit board
   */
  async salesBoardsEdit(
    _root,
    { _id, ...doc }: IBoardDocument,
    { models }: IContext,
  ) {
    return await models.Boards.updateBoard(_id, doc);
  },

  /**
   * Remove board
   */
  async salesBoardsRemove(
    _root,
    { _id }: { _id: string },
    { models, subdomain }: IContext,
  ) {
    const board = await models.Boards.getBoard(_id);

    const relatedFieldsGroups = await sendTRPCMessage({
      subdomain,

      pluginName: 'core',
      method: 'query',
      module: 'fieldsGroups',
      action: 'find',
      input: {
        query: {
          boardIds: board._id,
        },
      },
      defaultValue: [],
    });

    for (const fieldGroup of relatedFieldsGroups) {
      const boardIds = fieldGroup.boardIds || [];
      fieldGroup.boardIds = boardIds.filter((e) => e !== board._id);

      await sendTRPCMessage({
        subdomain,

        pluginName: 'core',
        method: 'mutation',
        module: 'fieldsGroups',
        action: 'updateGroup',
        input: { groupId: fieldGroup._id, fieldGroup },
      });
    }

    return models.Boards.removeBoard(_id);
  },

  async salesBoardItemUpdateTimeTracking(
    _root,
    {
      _id,
      status,
      timeSpent,
      startDate,
    }: {
      _id: string;
      status: string;
      timeSpent: number;
      startDate: string;
    },
    { models }: IContext,
  ) {
    return models.Boards.updateTimeTracking(_id, status, timeSpent, startDate);
  },

  async salesBoardItemsSaveForGanttTimeline(
    _root,
    { items, links }: { items: any[]; links: any[] },
    { models }: IContext,
  ) {
    const bulkOps: any[] = [];

    for (const item of items) {
      bulkOps.push({
        updateOne: {
          filter: {
            _id: item._id,
          },
          update: {
            $set: {
              startDate: item.startDate,
              closeDate: item.closeDate,
              relations: links.filter((link) => link.start === item._id),
            },
          },
        },
      });
    }

    await models.Deals.bulkWrite(bulkOps);

    return 'Success';
  },

  /**
   * Save board as template - saves board and all its pipelines as template
   */
  async salesBoardsSaveAsTemplate(
    _root,
    {
      _id,
      name,
      description,
      status,
    }: { _id: string; name: string; description?: string; status?: string },
    { models, subdomain, user }: IContext,
  ) {
    const board = await models.Boards.getBoard(_id);

    // Get all pipelines for this board
    const pipelines = await models.Pipelines.find({ boardId: _id }).lean();

    // For each pipeline, get its stages
    const pipelinesWithStages = await Promise.all(
      pipelines.map(async (pipeline: IPipelineDocument) => {
        const stages = await models.Stages.find({
          pipelineId: pipeline._id,
        }).lean();

        return {
          ...pipeline,
          stages,
        };
      }),
    );

    // Create template content
    const templateContent = {
      board: {
        name: board.name,
      },
      pipelines: pipelinesWithStages.map((pipeline: any) => ({
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
        order: pipeline.order,
        stages: pipeline.stages.map((stage: IStageDocument) => ({
          name: stage.name,
          probability: stage.probability,
          status: stage.status,
          order: stage.order,
        })),
      })),
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
          contentType: 'sales-board',
          pluginType: 'sales',
          description:
            description || `Template created from board: ${board.name}`,
          status: status || 'active',
        },
      },
    });

    return {
      success: true,
      templateId: template._id,
      message: 'Board and all pipelines saved as template successfully',
    };
  },
};
