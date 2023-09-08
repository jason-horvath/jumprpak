export type JwtRefreshTokenRecord = {
  id?: number,
  user_id: number,
  refresh_token: string,
  created_at?: string,
  update_at?: string,
  active?: number
}
