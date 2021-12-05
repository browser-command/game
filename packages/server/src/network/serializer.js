import { BinaryReader, BinaryWriter, Encoding } from 'csharp-binary-stream';
import { models } from './types.js';

export class Serializer {
	serialize(obj) {
		const id = obj['$id'];

		if (!id) {
			throw new Error('Object does not have an identifier');
		}

		const model = models.get(id);

		if (!model) {
			throw new Error(`Unknown identifier: ${id}`);
		}

		const writer = new BinaryWriter();

		writer.writeString(id, Encoding.Utf8);

		model.encode(obj, writer);

		return writer.toUint8Array();
	}

	/**
	 *
	 * @param {ArrayBufferLike} data
	 */
	deserialize(data) {
		const reader = new BinaryReader(data);

		const id = reader.readString(Encoding.Utf8);

		const model = models.get(id);

		if (!model) {
			throw new Error(`Unknown identifier: ${id}`);
		}

		return model.decode(reader);
	}
}
