import React from 'react';
import { MetricsBlock } from './MetricsBlock';
import { useInsightsStore } from '@/store/insights';
import { trpc } from '@/api/trpc';
import { useCurrentWorkspaceId } from '@/store/user';
import { sumBy } from 'lodash-es';
import { LuPlus } from 'react-icons/lu';
import { useTranslation } from '@i18next-toolkit/react';

export const MetricsSection: React.FC = React.memo(() => {
  const workspaceId = useCurrentWorkspaceId();
  const insightId = useInsightsStore((state) => state.insightId);
  const insightType = useInsightsStore((state) => state.insightType);
  const currentMetrics = useInsightsStore((state) => state.currentMetrics);
  const setMetrics = useInsightsStore((state) => state.setMetrics);
  const addMetrics = useInsightsStore((state) => state.addMetrics);
  const removeMetrics = useInsightsStore((state) => state.removeMetrics);
  const { t } = useTranslation();

  const { data: allEvents = [] } = trpc.insights.eventNames.useQuery(
    {
      workspaceId,
      insightId,
      insightType,
    },
    {
      enabled: Boolean(insightId),
      select(data) {
        return [{ name: '$all_event', count: sumBy(data, 'count') }, ...data];
      },
    }
  );

  return (
    <div>
      <div
        className="hover:bg-muted mb-2 flex cursor-pointer items-center justify-between rounded-lg px-2 py-1"
        onClick={() => {
          addMetrics();
        }}
      >
        <div>{t('Metrics')}</div>
        <div>
          <LuPlus />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {currentMetrics.map((metric, i) => (
          <MetricsBlock
            key={i}
            index={i}
            list={allEvents}
            info={metric}
            onSelect={(info) => setMetrics(i, info)}
            onDelete={() => removeMetrics(i)}
          />
        ))}
      </div>
    </div>
  );
});
MetricsSection.displayName = 'MetricsSection';
