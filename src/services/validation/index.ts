import { RuleResult, RuleResults } from './validation.types'

export function getErroredRules(results: RuleResults): RuleResults {
  const errors: RuleResults = new Map();

  for (const [key, value] of results) {
    value.forEach((result: RuleResult) => {
      if(result.error) {
        const errorVals = errors.get(key) ?? []
        errorVals.push(result);
        errors.set(key, errorVals);
      }
    })
  }

  return errors;
}
