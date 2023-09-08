export type AccessLogRecord = {
  id?: number,
  access_event_type_key: string,
  user_id: number | null,
  ip_address: string,
  user_agent: string,
  access_date?: string
}

export type AccessEventTypeRecord = {
  id?: number,
  event_type_key: string,
  description: string
}
