import { AccessLog, AccessEventType } from '_models';
import { AccessEventTypeRecord } from '_models/Log/log.schema';
import { AccessEventTypeKeys } from '_models/Log/access.types';
import { FindOneResult, InsertData, InsertResult } from '_models/model.types';
import { AppRequest } from '_http/request/request.types';
import { objectToInsertData } from '_utility/conversion';
import { AccessLogRecord } from '_models/Log/log.schema';

export async function accessLogEvent(eventTypeKey: AccessEventTypeKeys, req: AppRequest): Promise<InsertResult> {
  const accessLogData: AccessLogRecord = {
    access_event_type_key: eventTypeKey,
    user_id: typeof req.user !== 'undefined' ? req.user.id : null,
    ip_address: req.ip,
    user_agent: req.headers['user-agent'] ?? ''
  }

  const accessLogInsertData: InsertData = objectToInsertData(accessLogData);
  const insertResult = await new AccessLog().insert(accessLogInsertData);

  if (insertResult instanceof Error) {
    throw insertResult;
  }

  return insertResult;
}

export async function getAccessEventType(key: AccessEventTypeKeys): Promise<AccessEventTypeRecord> {
  const accessEvent: FindOneResult | Error = await new AccessEventType().findFirstByField('event_type_key', key);

  if (accessEvent instanceof Error) {
    throw accessEvent;
  }

  return accessEvent as AccessEventTypeRecord;
}
