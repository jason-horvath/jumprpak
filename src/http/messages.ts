import { AccessEventTypeKeys } from '_models/Log/access.types';
import { AccessEventTypeRecord } from '_models/Log/log.schema';
import { AccessEventType } from '_models';

const messages = new Map<AccessEventTypeKeys | string, string>(); 
(async () => {
  try {
    const accessEventTypes = await new AccessEventType().findAll() as AccessEventTypeRecord[];

    if(accessEventTypes instanceof Error) {
      throw accessEventTypes;
    }

    accessEventTypes.forEach((type) => {
      messages.set(type.event_type_key, type.description);
    })
  } catch (error: any) {
    console.error('Messages failed to initialize:', error.message);
  }
  


})();

export default messages;
