import { InsertData } from '_models/model.types';
import { trimDataObject } from './sanitize';
export function mapToObject(subjectMap: Map<any, any>): Object {
  return Object.fromEntries(subjectMap.entries());
}

export function objectToInsertData(data: Object): InsertData {
  const trimmedData = trimDataObject(data);
  return new Map(Object.entries(trimmedData));
}
