export interface RuleInterface {
  (value: RuleValue | number, label: string, params?: RuleParams): RuleResult | Promise<RuleResult>
}
export interface RuleArgs { value: RuleValue | number, label: string, params?: RuleParams };

export type RuleReturn = boolean;

export type RuleParams = {
  [key: string]: any
}

export type RuleValue = string | number | Array<any> | Map<string, any>;

export type RuleResults = Map<string, RuleResult[]>;

export type RuleResult = {
  error: boolean,
  message: string,
  rule: string
}

export type ValidationState = {
  error: boolean,
  message: string,
  type: string,
  key?: string
}
