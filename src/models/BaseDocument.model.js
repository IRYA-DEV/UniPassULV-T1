export class BaseDocumentModel {
    async get(id, IdDocumento) {
        throw new Error("Not implemented");
    }

    async getAll() {
        throw new Error("Not implemented");
    }

    async save(data) {
        throw new Error("Not implemented");
    }

    async update(id, data) {
        throw new Error("Not implemented");
    }

    async delete(id) {
        throw new Error("Not implemented");
    }
}
