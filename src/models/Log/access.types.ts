/**
 * AccessEventTypeKeys comes from the access_event_types.event_type_key field.
 *
 * The table is not intended to change often, but when it does, run:
 * SELECT GROUP_CONCAT(CONCAT('\'', event_type_key, '\'') SEPARATOR ' |\n' ) FROM access_event_types ORDER BY event_type_key;
 *
 * Then paste the result to update this type to match the table.
 *
 * This is meant to be a helper when looking fo messages to use.
 */

export type AccessEventTypeKeys =
  | 'invalid_password_reset_attempt'
  | 'invalid_password_reset_request'
  | 'invalid_password_reset_token'
  | 'invalid_register_input'
  | 'invalid_verify_account_token'
  | 'password_reset_failure'
  | 'password_reset_success'
  | 'password_reset_token_created'
  | 'subscription_canceled'
  | 'subscription_changed'
  | 'subscription_completed'
  | 'user_account_created'
  | 'user_account_verified'
  | 'user_address_added'
  | 'user_address_deleted'
  | 'user_address_set_primary'
  | 'user_jwt_set_issued'
  | 'user_jwt_refresh'
  | 'user_jwt_refresh_invalid'
  | 'user_login_attempt'
  | 'user_login_failed'
  | 'user_login_success';
