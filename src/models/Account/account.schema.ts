export type NewUserData = {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  password: string
}

export type ActiveRecord = {
  created_at?: string,
  updated_at?: string,
  active?: number
}

export type UserRecord = {
  id?: number,
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  password: string,
} & ActiveRecord;

export type PasswordResetTokenRecord = {
  id?: number,
  user_id: number,
  reset_token: string
} & ActiveRecord;

export type VerifyAccountTokenRecord = {
  id?: number,
  user_id: number,
  verify_token: string
} & ActiveRecord;
