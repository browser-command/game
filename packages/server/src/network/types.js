import { Encoding } from 'csharp-binary-stream';

/** @typedef {{
 *  type: string,
 *  create: (...args: any[]) => any,
 *  encode: (value: any, writer: import('csharp-binary-stream').BinaryWriter) => void,
 *  decode: (reader: import('csharp-binary-stream').BinaryReader) => any
 *  }} Datatype */

/**
 * @type {Map<string, Datatype>}
 */
export const models = new Map();

/**
 * @param {string} id
 * @param {Record<string, Datatype>} schema
 */
export const model = (id, schema) => {
	const model = {
		type: 'model',
		id,
		create: (properties) => {
			const obj = {};

			obj['$id'] = id;

			for (const [key, value] of Object.entries(schema)) {
				obj[key] = value.create();
			}

			if (properties && typeof properties === 'object') {
				for (const [key, value] of Object.entries(properties)) {
					if (!schema[key]) {
						throw new Error(`Unknown property: ${key}`);
					}

					obj[key] = value;
				}
			}

			return obj;
		},
		encode: (value, writer) => {
			writer.writeString(id, Encoding.Utf8);
			for (const key of Object.keys(schema).sort()) {
				schema[key].encode(value[key], writer);
			}
		},
		decode: (reader) => {
			const obj = {};

			const id = reader.readString(Encoding.Utf8);
			if (id !== id) {
				throw new Error('Invalid model id');
			}

			obj['$id'] = id;

			for (const key of Object.keys(schema).sort()) {
				obj[key] = schema[key].decode(reader);
			}

			return obj;
		},
	};

	models.set(id, model);

	return model;
};

/**
 * @type {Datatype}
 */
export const float = {
	type: 'float',
	create: () => 0.0,
	encode: (value, writer) => writer.writeFloat(value),
	decode: (reader) => reader.readFloat(),
};

/**
 * @type {Datatype}
 */
export const int32 = {
	type: 'int32',
	create: () => 0,
	encode: (value, writer) => writer.writeInt(value),
	decode: (reader) => reader.readInt(),
};

/**
 * @type {Datatype}
 */
export const uint32 = {
	type: 'uint32',
	create: () => 0,
	encode: (value, writer) => writer.writeUnsignedInt(value),
	decode: (reader) => reader.readUnsignedInt(),
};

/**
 * @type {Datatype}
 */
export const int16 = {
	type: 'int16',
	create: () => 0,
	encode: (value, writer) => writer.writeShort(value),
	decode: (reader) => reader.readShort(),
};

/**
 * @type {Datatype}
 */
export const uint16 = {
	type: 'uint16',
	create: () => 0,
	encode: (value, writer) => writer.writeUnsignedShort(value),
	decode: (reader) => reader.readUnsignedShort(),
};

/**
 * @type {Datatype}
 */
export const int8 = {
	type: 'int8',
	create: () => 0,
	encode: (value, writer) => writer.writeSignedByte(value),
	decode: (reader) => reader.readSignedByte(),
};

/**
 * @type {Datatype}
 */
export const uint8 = {
	type: 'uint8',
	create: () => 0,
	encode: (value, writer) => writer.writeByte(value),
	decode: (reader) => reader.readByte(),
};

/**
 * @type {Datatype}
 */
export const string = {
	type: 'string',
	create: () => '',
	encode: (value, writer) => writer.writeString(value, Encoding.Utf8),
	decode: (reader) => reader.readString(Encoding.Utf8),
};

/**
 * @param {Datatype} element
 */
export const array = (element) => {
	return {
		type: 'array',
		create: () => [],
		encode: (value, writer) => {
			writer.writeUnsignedInt(value.length);
			for (const item of value) {
				element.encode(item, writer);
			}
		},
		decode: (reader) => {
			const length = reader.readUnsignedInt();
			const result = [];
			for (let i = 0; i < length; i++) {
				result.push(element.decode(reader));
			}
			return result;
		},
	};
};

/**
 * @param {Datatype} element
 */
export const map = (element) => {
	return {
		type: 'map',
		create: () => new Map(),
		encode: (value, writer) => {
			writer.writeUnsignedInt(value.size);
			for (const [key, item] of value) {
				writer.writeString(key, Encoding.Utf8);
				element.encode(item, writer);
			}
		},
		decode: (reader) => {
			const length = reader.readUnsignedInt();
			const result = new Map();
			for (let i = 0; i < length; i++) {
				const key = reader.readString(Encoding.Utf8);
				result.set(key, element.decode(reader));
			}
			return result;
		},
	};
};

export const object = () => {
	return {
		type: 'object',
		create: () => ({}),
		encode: (value, writer) => {
			if (!!value && value.constructor === Object) {
				writer.writeBoolean(true);

				const id = value['$id'];
				const model = models.get(id);
				if (model) {
					writer.writeString(id, Encoding.Utf8);
					model.encode(value, writer);
				} else {
					throw new Error(`Unknown model ${id}`);
				}

				return;
			}

			writer.writeBoolean(false);
			writer.writeUnsignedInt(Object.keys(value).length);
			for (const key of Object.keys(value)) {
				writer.writeString(key, Encoding.Utf8);
				const type = typeof value[key];
				writer.writeString(type, Encoding.Utf8);
				if (type === 'string') {
					writer.writeString(value[key], Encoding.Utf8);
				} else if (type === 'number') {
					writer.writeDouble(value[key]);
				} else if (type === 'boolean') {
					writer.writeBoolean(value[key]);
				} else {
					throw new Error(`Unknown type ${type}`);
				}
			}
		},
		decode: (reader) => {
			const isModel = reader.readBoolean();

			if (isModel) {
				const id = reader.readString(Encoding.Utf8);
				const model = models.get(id);
				if (model) {
					return model.decode(reader);
				} else {
					throw new Error(`Unknown model ${id}`);
				}
			}

			const length = reader.readUnsignedInt();
			const result = {};
			for (let i = 0; i < length; i++) {
				const key = reader.readString(Encoding.Utf8);
				const type = reader.readString(Encoding.Utf8);
				if (type === 'string') {
					result[key] = reader.readString(Encoding.Utf8);
				} else if (type === 'number') {
					result[key] = reader.readDouble();
				} else if (type === 'boolean') {
					result[key] = reader.readBoolean();
				} else {
					throw new Error(`Unknown type ${type}`);
				}
			}
		},
	};
};
