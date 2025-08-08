import { Prisma } from '@prisma/client';
import { InsightsSqlBuilder } from '../shared.js';
import {
  dateTypeSchema,
  getWarehouseApplications,
  getWarehouseConnection,
  MYSQL_DATE_FORMATS,
  WarehouseWideTableInsightsApplication,
} from './utils.js';
import dayjs from 'dayjs';
import { z } from 'zod';
import { insightsQuerySchema } from '../../../utils/schema.js';
import { processGroupedTimeSeriesData } from '../utils.js';

export class WarehouseWideTableInsightsSqlBuilder extends InsightsSqlBuilder {
  getApplication(): WarehouseWideTableInsightsApplication {
    const name = this.query.insightId;

    const application = getWarehouseApplications().find(
      (app) => app.name === name && app.type === 'wideTable'
    ) as WarehouseWideTableInsightsApplication;

    if (!application) {
      throw new Error(`Application ${name} not found`);
    }

    return application;
  }

  private enableDateBasedOptimizedEventTable() {
    const application = this.getApplication();
    const startAt = this.query.time.startAt;
    const endAt = this.query.time.endAt;

    return (
      !!application.dateBasedCreatedAtField &&
      dayjs(endAt).diff(startAt, 'day') >= 1
    );
  }

  protected buildOptimizedDateRangeQuery(): Prisma.Sql {
    const { time } = this.query;
    const { startAt, endAt } = time;
    const application = this.getApplication();

    const enableDateBasedOptimizedEventTable =
      this.enableDateBasedOptimizedEventTable();
    const type = application.createdAtFieldType;

    let startTime = String(dayjs(startAt).valueOf());
    let endTime = String(dayjs(endAt).valueOf());

    let field = enableDateBasedOptimizedEventTable
      ? `"${application.dateBasedCreatedAtField ?? application.createdAtField}"`
      : `"${application.createdAtField}"`;

    if (this.enableDateBasedOptimizedEventTable()) {
      // if enable date based optimized event table,
      // and the date range is more than 1 day,
      // we need to use the date based created at field
      startTime = String(dayjs(startAt).startOf('day').format('YYYY-MM-DD'));
      endTime = String(dayjs(endAt).endOf('day').format('YYYY-MM-DD'));
    } else {
      if (type === 'timestamp') {
        // Unix timestamp in seconds
        startTime = String(dayjs(startAt).unix());
        endTime = String(dayjs(endAt).unix());
      }
      if (type === 'date') {
        // Date string format (YYYY-MM-DD)
        startTime = dayjs(startAt).startOf('day').format('YYYY-MM-DD');
        endTime = dayjs(endAt).endOf('day').format('YYYY-MM-DD');
      }
      if (type === 'datetime') {
        // Datetime string format (YYYY-MM-DD HH:mm:ss)
        startTime = dayjs(startAt).utc().format('YYYY-MM-DD HH:mm:ss');
        endTime = dayjs(endAt).utc().format('YYYY-MM-DD HH:mm:ss');
      }
    }

    return Prisma.sql`${Prisma.raw(field)} BETWEEN ${startTime} AND ${endTime}`;
  }

  protected getTableName(): string {
    return this.getApplication().tableName;
  }

  protected getDateQuery(
    field: string,
    unit: string,
    timezone: string,
    type: z.infer<typeof dateTypeSchema> = 'timestampMs'
  ): Prisma.Sql {
    // Check if unit exists in MYSQL_DATE_FORMATS before using it
    if (!(unit in MYSQL_DATE_FORMATS)) {
      throw new Error(`Invalid date unit: ${unit}`);
    }

    const format = MYSQL_DATE_FORMATS[unit as keyof typeof MYSQL_DATE_FORMATS];
    let timeExpression: Prisma.Sql;

    switch (type) {
      case 'timestamp':
        // Unix timestamp in seconds - convert to datetime first
        timeExpression = Prisma.sql`FROM_UNIXTIME(${Prisma.raw(field)})`;
        break;
      case 'timestampMs':
        // Unix timestamp in milliseconds - convert to seconds first, then to datetime
        timeExpression = Prisma.sql`FROM_UNIXTIME(${Prisma.raw(field)} / 1000)`;
        break;
      case 'date':
        // Date string format (YYYY-MM-DD) - convert to datetime
        timeExpression = Prisma.sql`STR_TO_DATE(${Prisma.raw(field)}, '%Y-%m-%d')`;
        break;
      case 'datetime':
        // Datetime string format (YYYY-MM-DD HH:MM:SS) - use directly
        timeExpression = Prisma.sql`STR_TO_DATE(${Prisma.raw(field)}, '%Y-%m-%d %H:%i:%s')`;
        break;
      default:
        // Default to timestampMs for backwards compatibility
        timeExpression = Prisma.sql`FROM_UNIXTIME(${Prisma.raw(field)} / 1000)`;
        break;
    }

    return Prisma.sql`DATE_FORMAT(CONVERT_TZ(${timeExpression}, '+00:00', ${timezone}), '${Prisma.raw(format)}')`;
  }

  private buildOptimizedDateQuerySql(): Prisma.Sql {
    const { time } = this.query;
    const { unit, timezone = 'UTC' } = time;
    const application = this.getApplication();

    if (
      this.enableDateBasedOptimizedEventTable() &&
      application.dateBasedCreatedAtField
    ) {
      const field = `"${application.dateBasedCreatedAtField}"`;
      const format =
        MYSQL_DATE_FORMATS[unit as keyof typeof MYSQL_DATE_FORMATS];

      return Prisma.sql`DATE_FORMAT(${Prisma.raw(field)}, '${Prisma.raw(format)}') date`;
    } else {
      return Prisma.sql`${this.getDateQuery(
        `"${application.createdAtField}"`,
        unit,
        timezone,
        application.createdAtFieldType
      )} date`;
    }
  }

  protected buildDateQuerySql(): Prisma.Sql {
    return this.buildOptimizedDateQuerySql();
  }

  protected buildSelectQueryArr(): (Prisma.Sql | null)[] {
    const { metrics } = this.query;
    const application = this.getApplication();

    return metrics.map((item) => {
      if (item.math === 'events') {
        if (item.name === '$all_event') {
          return Prisma.sql`count(1) as "$all_event"`;
        }

        return Prisma.sql`count("${Prisma.raw(item.name)}") as "${Prisma.raw(item.name)}"`;
      } else if (item.math === 'sessions') {
        if (item.name === '$all_event') {
          return Prisma.sql`count(distinct "${Prisma.raw(application.distinctField)}") as "$all_event"`;
        }

        return Prisma.sql`count(distinct case WHEN "${Prisma.raw(item.name)}" = ${item.name} THEN "${Prisma.raw(application.distinctField)}" END) as ${Prisma.raw(`"${item.name}"`)}`;
      }

      return null;
    });
  }

  buildWhereQueryArr() {
    const { filters } = this.query;

    return [
      // date range
      this.buildOptimizedDateRangeQuery(),

      ...filters.map((filter) =>
        this.buildCommonFilterQueryOperator(
          filter.type,
          filter.operator,
          filter.value,
          Prisma.sql`"${Prisma.raw(filter.name)}"`
        )
      ),
    ];
  }

  buildGroupSelectQueryArr() {
    const { groups } = this.query;
    let groupSelectQueryArr: Prisma.Sql[] = [];
    if (groups.length > 0) {
      for (const g of groups) {
        if (!g.customGroups) {
          groupSelectQueryArr.push(
            Prisma.sql`${Prisma.raw(g.value)} as "%${Prisma.raw(g.value)}"`
          );
        } else if (g.customGroups && g.customGroups.length > 0) {
          for (const cg of g.customGroups) {
            groupSelectQueryArr.push(
              Prisma.sql`${this.buildCommonFilterQueryOperator(
                g.type,
                cg.filterOperator,
                cg.filterValue,
                Prisma.sql`"${Prisma.raw(g.value)}"`
              )} as "%${Prisma.raw(`${g.value}|${cg.filterOperator}|${cg.filterValue}`)}"`
            );
          }
        }
      }
    }

    return groupSelectQueryArr;
  }

  async executeQuery(sql: Prisma.Sql): Promise<any[]> {
    const application = this.getApplication();
    const connection = getWarehouseConnection(application.databaseUrl);

    const [rows] = await connection.query(
      sql.sql.replaceAll('"', '`'), // avoid mysql and pg sql syntax error about double quote
      sql.values
    );

    return rows as any[];
  }
}

export async function insightsWideTableWarehouse(
  query: z.infer<typeof insightsQuerySchema>,
  context: { timezone: string }
) {
  const builder = new WarehouseWideTableInsightsSqlBuilder(query, context);
  const sql = builder.build();

  const data = await builder.executeQuery(sql);

  const result = processGroupedTimeSeriesData(query, context, data);

  return result;
}

export async function insightsWideTableWarehouseEvents(
  applicationId: string
): Promise<string[]> {
  const application = getWarehouseApplications().find(
    (app) => app.name === applicationId && app.type === 'wideTable'
  ) as WarehouseWideTableInsightsApplication;

  if (!application) {
    throw new Error(`Event table not found for application: ${applicationId}`);
  }

  return application.fields.map((field) => field.name);
}

export async function insightsWideTableWarehouseFilterParams(
  applicationId: string
): Promise<string[]> {
  return insightsWideTableWarehouseEvents(applicationId);
}
