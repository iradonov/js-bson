import type { EJSONOptions } from './extended_json';

function alphabetize(str: string): string {
  return str.split('').sort().join('');
}

export type BSONRegExpEJSON =
  | { $regex: string | BSONRegExp; $options: string }
  | { $regularExpression: { pattern: string; options: string } };

/** A class representation of the BSON RegExp type. */
export class BSONRegExp {
  _bsontype!: 'BSONRegExp';

  pattern: string;
  options: string;
  /**
   * @param pattern - The regular expression pattern to match
   * @param options - The regular expression options
   */
  constructor(pattern: string, options?: string) {
    this.pattern = pattern;
    this.options = options ?? '';
    // Execute
    alphabetize(this.options);

    // Validate options
    for (let i = 0; i < this.options.length; i++) {
      if (
        !(
          this.options[i] === 'i' ||
          this.options[i] === 'm' ||
          this.options[i] === 'x' ||
          this.options[i] === 'l' ||
          this.options[i] === 's' ||
          this.options[i] === 'u'
        )
      ) {
        throw new Error(`The regular expression option [${this.options[i]}] is not supported`);
      }
    }
  }

  static parseOptions(options?: string): string {
    return options ? options.split('').sort().join('') : '';
  }

  /** @internal */
  toExtendedJSON(options?: EJSONOptions): BSONRegExpEJSON {
    options = options || {};
    if (options.legacy) {
      return { $regex: this.pattern, $options: this.options };
    }
    return { $regularExpression: { pattern: this.pattern, options: this.options } };
  }

  /** @internal */
  static fromExtendedJSON(doc: BSONRegExpEJSON): BSONRegExp {
    if ('$regex' in doc) {
      if (typeof doc.$regex !== 'string') {
        // This is for $regex query operators that have extended json values.
        if (doc.$regex._bsontype === 'BSONRegExp') {
          return (doc as unknown) as BSONRegExp;
        }
      } else {
        return new BSONRegExp(doc.$regex, BSONRegExp.parseOptions(doc.$options));
      }
    }
    if ('$regularExpression' in doc) {
      return new BSONRegExp(
        doc.$regularExpression.pattern,
        BSONRegExp.parseOptions(doc.$regularExpression.options)
      );
    }
    throw new TypeError(`Unexpected BSONRegExp EJSON object form: ${JSON.stringify(doc)}`);
  }
}

Object.defineProperty(BSONRegExp.prototype, '_bsontype', { value: 'BSONRegExp' });
