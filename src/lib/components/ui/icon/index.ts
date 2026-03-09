import { HlmIconDirective } from './hlm-icon.directive';
import { HlmIconComponent } from './hlm-icon.component';

export * from './hlm-icon.directive';
export * from './hlm-icon.component';
export * from './hlm-icon.token';

export const HlmIconImports = [HlmIconDirective, HlmIconComponent] as const;
