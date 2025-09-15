import { z } from 'zod';
import { insightsQueryEventsSchema } from '../../../utils/schema.js';
import { WarehouseLongTableInsightsSqlBuilder } from './longTable.js';
import { findWarehouseApplication } from './utils.js';
import { WarehouseWideTableInsightsSqlBuilder } from './wideTable.js';

export async function queryWarehouseEvents(
  query: z.infer<typeof insightsQueryEventsSchema>,
  context: { timezone: string }
) {
  const application = await findWarehouseApplication(
    query.workspaceId,
    query.insightId
  );

  if (application?.type === 'wideTable') {
    const builder = new WarehouseWideTableInsightsSqlBuilder(query, context);
    return builder.queryEvents(query.cursor);
  }

  const builder = new WarehouseLongTableInsightsSqlBuilder(query, context);
  return builder.queryEvents(query.cursor);
}
