import { registerNodeDefinitions } from './node-registry'
import { ManualTriggerDef } from './node-definitions/trigger-manual'
import { ScheduleTriggerDef } from './node-definitions/trigger-schedule'
import { GenerateFetchQueueDef } from './node-definitions/crawl-generate-fetch-queue'
import { CrawlPageDef } from './node-definitions/crawl-crawl-page'
import { NormalizeProductsDef } from './node-definitions/product-normalize'
import { FilterProductsDef } from './node-definitions/product-filter'
import { ValidateAffiliateLinkDef } from './node-definitions/affiliate-validate-link'
import { GenerateContentIdeasDef } from './node-definitions/content-generate-ideas'
import { CreateContentQueueDef } from './node-definitions/content-create-queue'
import { RecordPublishResultDef } from './node-definitions/publish-record-result'
import { SyncPerformanceDef } from './node-definitions/metric-sync-performance'
import { ConditionDef } from './node-definitions/logic-condition'
import { LoopDef } from './node-definitions/logic-loop'
import { DelayWaitUntilDef } from './node-definitions/logic-delay'
import { NotificationDef } from './node-definitions/utility-notification'

import type { WorkflowNodeDefinition } from './node-types'

type AnyDef = WorkflowNodeDefinition<Record<string, unknown>>

const ALL = [
  ManualTriggerDef,
  ScheduleTriggerDef,
  GenerateFetchQueueDef,
  CrawlPageDef,
  NormalizeProductsDef,
  FilterProductsDef,
  ValidateAffiliateLinkDef,
  GenerateContentIdeasDef,
  CreateContentQueueDef,
  RecordPublishResultDef,
  SyncPerformanceDef,
  ConditionDef,
  LoopDef,
  DelayWaitUntilDef,
  NotificationDef,
] as unknown as AnyDef[]

registerNodeDefinitions(ALL)

export {
  ManualTriggerDef,
  ScheduleTriggerDef,
  GenerateFetchQueueDef,
  CrawlPageDef,
  NormalizeProductsDef,
  FilterProductsDef,
  ValidateAffiliateLinkDef,
  GenerateContentIdeasDef,
  CreateContentQueueDef,
  RecordPublishResultDef,
  SyncPerformanceDef,
  ConditionDef,
  LoopDef,
  DelayWaitUntilDef,
  NotificationDef,
  ALL as ALL_NODE_DEFINITIONS,
}

export type { ManualTriggerProps } from './node-definitions/trigger-manual'
export type { ScheduleTriggerProps } from './node-definitions/trigger-schedule'
export type { GenerateFetchQueueProps } from './node-definitions/crawl-generate-fetch-queue'
export type { CrawlPageProps } from './node-definitions/crawl-crawl-page'
export type { NormalizeProductsProps } from './node-definitions/product-normalize'
export type { FilterProductsProps } from './node-definitions/product-filter'
export type { ValidateAffiliateLinkProps } from './node-definitions/affiliate-validate-link'
export type { GenerateContentIdeasProps } from './node-definitions/content-generate-ideas'
export type { CreateContentQueueProps } from './node-definitions/content-create-queue'
export type { RecordPublishResultProps } from './node-definitions/publish-record-result'
export type { SyncPerformanceProps } from './node-definitions/metric-sync-performance'
export type { ConditionProps } from './node-definitions/logic-condition'
export type { LoopProps } from './node-definitions/logic-loop'
export type { DelayWaitUntilProps } from './node-definitions/logic-delay'
export type { NotificationProps } from './node-definitions/utility-notification'
