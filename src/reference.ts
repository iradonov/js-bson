import { EJSONOptions, ObjectId } from './bson';
import { BSONValue } from './bson_value';

/** @public */
export interface ReferenceExtended {
  $reference: string;
}

/**
 * A class representation of the BSON MaxKey type.
 * @public
 * @category BSONType
 */
export class Reference extends BSONValue {
  get _bsontype(): 'MaxKey' {
    return 'MaxKey';
  }

  /** @internal */
  toExtendedJSON(): ReferenceExtended {
    return { $reference: '' };
  }

  /** @internal */
  static fromExtendedJSON(doc: any, options: EJSONOptions): ObjectId {
    return new ObjectId((options.refMap ?? {})[doc.$reference]);
  }

  inspect(): string {
    return 'new MaxKey()';
  }
}
