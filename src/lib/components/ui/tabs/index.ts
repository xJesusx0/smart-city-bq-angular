import { HlmTabsContentDirective } from './hlm-tabs-content.directive';
import { HlmTabsListDirective } from './hlm-tabs-list.directive';
import { HlmTabsTriggerDirective } from './hlm-tabs-trigger.directive';
import { HlmTabsDirective } from './hlm-tabs.directive';

export * from './hlm-tabs-content.directive';
export * from './hlm-tabs-list.directive';
export * from './hlm-tabs-trigger.directive';
export * from './hlm-tabs.directive';

export const HlmTabsImports = [
  HlmTabsDirective,
  HlmTabsListDirective,
  HlmTabsTriggerDirective,
  HlmTabsContentDirective,
] as const;
