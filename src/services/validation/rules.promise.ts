import { RuleInterface, RuleResult } from './validation.types';
import { PasswordResetToken, User, VerifyAccountToken } from '_models';
import { createRuleResult } from './rules';
import { FindOneResult } from '_models/model.types';
import { RowDataPacket } from 'mysql2/promise';

export async function emailExistsRule(...args: Parameters<RuleInterface>): Promise<RuleResult> {
  const [value, label ] = args;
  const emailRows: RowDataPacket[] | Error = await new User().findByField('email', String(value));
  
  if (emailRows instanceof Error) {
      throw emailRows;
  }

  const emailExists: boolean = emailRows.length > 0;
  
  return createRuleResult(emailExists , `${label} already exists.`, 'email_exists');
}

export async function emailNotExistsRule(...args: Parameters<RuleInterface>): Promise<RuleResult> {
  const [value, label] =  args;
  const emailRows: FindOneResult | Error = await new User().findFirstByField('email', String(value));

  if (emailRows instanceof Error) {
      throw emailRows;
  }

  const emailNotExists: boolean = Object.keys(emailRows).length === 0;
  
  return createRuleResult(emailNotExists, `${label} does not exist.`, 'email_not_exists');
} 

export async function passwordResetTokenNotFoundRule(...args: Parameters<RuleInterface>): Promise<RuleResult> {
  const [value, label] = args;
  const tokenRows: FindOneResult| Error = await new PasswordResetToken().findActiveByField('reset_token', String(value));

  if (tokenRows instanceof Error) {
      throw tokenRows;
  }

  const tokenNotFound = Object.keys(tokenRows).length < 1;

  return createRuleResult(tokenNotFound , `${label} does not exist.`, 'password_reset_token_not_found');
}

export async function verifyAccountTokenNotFoundRule(...args: Parameters<RuleInterface>): Promise<RuleResult> {
  const [value, label] = args;
  const tokenRows: FindOneResult | Error = await new VerifyAccountToken().findActiveByField('verify_token', String(value));

  if (tokenRows instanceof Error) {
      throw tokenRows;
  }

  const tokenNotFound = Object.keys(tokenRows).length < 1;

  return createRuleResult(tokenNotFound , `${label} does not exist.`, 'verify_account_token_not_found');
}
