import { RuleInterface, RuleResult, RuleResults } from './validation.types';

export function createRuleResult(error: boolean, message: string, rule: string): RuleResult {
  const output = error ? message : '';
  return {
    error,
    message: output,
    rule,
  };
}

export function emailRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const res =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const error = !res.test(String(value).toLowerCase());

  return createRuleResult(error, `${label} must be a valid email format.`, 'email');
}

export function passwordConfirmRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label, params] = args;
  const rule = 'password_confirm';

  try {
    if (typeof params !== 'undefined' && !('password' in params)) {
      throw new Error(`The params.password' property is missing from passwordConfirmRule() and must be passed in.`);
    }
    const password_confirm = String(value);
    const password = String(params?.password);
    const error = !(password_confirm === password && password_confirm.length >= 8);

    return createRuleResult(error, `${label} must be matching.`, rule);
  } catch (error) {
    console.error(error);
    return createRuleResult(true, 'Password confirmation had unexpected errors', rule);
  }
}

export function passwordRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/;
  const error = !password.test(String(value));

  return createRuleResult(
    error,
    `${label} must be alphanumeric 8 characters and contain uppercase, lowercase, and one special character.`,
    'password'
  );
}

export function phoneRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const phone = /^\d{10}$/;
  const error = !phone.test(String(value));

  return createRuleResult(error, `Please enter a valid ${label}. (Must be 10 digits)`, 'phone');
}

export function requiredRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const error = String(value).length < 1 || typeof value === 'undefined';

  return createRuleResult(error, `${label} is a required field`, 'required');
}

export function passwordResetTokenLengthRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const { PASSWORD_RESET_TOKEN_LENGTH } = process.env;
  const error = String(value).length < Number(PASSWORD_RESET_TOKEN_LENGTH) * 2;

  return createRuleResult(error, `${label} does not meet length requirements`, 'password_reset_token_length');
}

export function verifyTokenLengthRule(...args: Parameters<RuleInterface>): RuleResult {
  const [value, label] = args;
  const { VERFIY_ACCOUNT_TOKEN_LENGTH } = process.env;
  const error = String(value).length < Number(VERFIY_ACCOUNT_TOKEN_LENGTH) * 2;

  return createRuleResult(error, `${label} does not meet length requirements`, 'verify_token_length');
}
