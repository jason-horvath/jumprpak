import { RuleResults } from '_services/validation/validation.types';
import { ApiResponseBody, ResponseData, ResponseErrors, ResponseMeta } from './response.types';
import { AccessMessage, AccessMessageKeys, AccessMessages } from '_http/http.types';
import { mapToObject } from '_utility/conversion';
import messages from '_http/messages';

export default class ApiResponse {
  private body: ApiResponseBody = {
    status: 200,
    message: '',
    data: {},
    errors: {},
    meta: {}
  }

  private messages: AccessMessages = new Map<AccessMessageKeys, AccessMessage>()

  constructor() {
    this.messages = messages as AccessMessages;
  }

  public setStatus(status: number): this {
    this.body.status = status;
  
    return this;
  }

  public setData(data: ResponseData): this {
    this.body.data = data;

    return this;
  }

  public mergeData(data: ResponseData): this {
    const mergeData = { ...this.body.data, ...data };

    this.body.data = mergeData;

    return this;
  }

  public setServerErrors(error: any): this {
    this.body.errors = { ...this.body.errors, ...{ server: error } }
  
    return this;
  }

  public setValidationErrors(results: RuleResults): this {
    const count = results.size;
    const errors = mapToObject(results);
    
    const validation = {
      validation: {
        count,
        fields: errors
      }
    }
    
    this.body.errors = { ...this.body.errors, ...validation }
    
    return this;
  }

  public setErrors(errors: ResponseErrors): this {
    this.body.errors = errors;

    return this;
  }

  public setMessage(message: string): this {
    this.body.message = message;

    return this;
  }

  public setMessageFromKey(key: AccessMessageKeys): this {
    const message = this.messages.get(key) ?? '';
    this.setMessage(message);

    return this;
  }

  public setMeta(meta: ResponseMeta) {
    this.body.meta = meta;

    return this;
  }

  public getBody(): ApiResponseBody {
    return this.body;
  }
}
