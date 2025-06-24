import { defaultErrorHandler, trpc } from '@/api/trpc';
import { CommonHeader } from '@/components/CommonHeader';
import { CommonWrapper } from '@/components/CommonWrapper';
import { AddServerStep } from '@/components/server/AddServerStep';
import { InstallScript } from '@/components/server/InstallScript';
import { ServerList } from '@/components/server/ServerList';
import { ServerCardView } from '@/components/server/ServerCardView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventWithLoading } from '@/hooks/useEvent';
import { Layout } from '@/components/layout';
import { useCurrentWorkspaceId } from '@/store/user';
import { routeAuthBeforeLoad } from '@/utils/route';
import { useTranslation } from '@i18next-toolkit/react';
import { createFileRoute } from '@tanstack/react-router';
import { Popconfirm } from 'antd';
import React from 'react';
import { LuPlus, LuTable, LuGrid3X3 } from 'react-icons/lu';
import { useLocalStorageState } from 'ahooks';

export const Route = createFileRoute('/server')({
  beforeLoad: routeAuthBeforeLoad,
  component: ServerComponent,
});

function ServerComponent() {
  return (
    <Layout>
      <ServerContent />
    </Layout>
  );
}

export const ServerContent: React.FC = React.memo(() => {
  const [hideOfflineServer = false, setHideOfflineServer] =
    useLocalStorageState<boolean>('server-hide-offline-server', {
      defaultValue: false,
    });
  const [viewMode, setViewMode] = useLocalStorageState<'list' | 'card'>(
    'server-view-mode',
    { defaultValue: 'list' }
  );
  const { t } = useTranslation();
  const workspaceId = useCurrentWorkspaceId();

  const clearOfflineNodeMutation =
    trpc.serverStatus.clearOfflineServerStatus.useMutation({
      onError: defaultErrorHandler,
    });

  const [handleClearOfflineNode, loading] = useEventWithLoading(async (e) => {
    await clearOfflineNodeMutation.mutateAsync({
      workspaceId,
    });
  });

  return (
    <CommonWrapper
      header={
        <CommonHeader
          title={t('Servers')}
          actions={
            <div className="flex items-center gap-2">
              <Switch
                checked={hideOfflineServer}
                onCheckedChange={setHideOfflineServer}
              />

              <span>{t('Hide Offline')}</span>

              <Popconfirm
                title={t('Clear Offline Node')}
                description={t('Are you sure to clear all offline node?')}
                disabled={loading}
                onConfirm={handleClearOfflineNode}
              >
                <Button loading={loading}>{t('Clear Offline')}</Button>
              </Popconfirm>

              <Separator orientation="vertical" className="h-6" />

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-md border">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 rounded-r-none border-r px-2"
                >
                  <LuTable className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="h-8 rounded-l-none px-2"
                >
                  <LuGrid3X3 className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" Icon={LuPlus}>
                    {t('Add')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div>
                    <Tabs defaultValue="auto">
                      <TabsList>
                        <TabsTrigger value="auto">{t('Auto')}</TabsTrigger>
                        <TabsTrigger value="manual">{t('Manual')}</TabsTrigger>
                      </TabsList>
                      <TabsContent value="auto">
                        <InstallScript />
                      </TabsContent>
                      <TabsContent value="manual">
                        <AddServerStep />
                      </TabsContent>
                    </Tabs>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogAction>{t('Continue')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          }
        />
      }
    >
      <div
        className={
          viewMode === 'card'
            ? 'h-full overflow-auto p-4'
            : 'h-full overflow-hidden p-4'
        }
      >
        {viewMode === 'list' ? (
          <ServerList hideOfflineServer={hideOfflineServer} />
        ) : (
          <ServerCardView hideOfflineServer={hideOfflineServer} />
        )}
      </div>
    </CommonWrapper>
  );
});
ServerContent.displayName = 'ServerContent';
