import DoctosModel from "../models/doctos.model.js";

class DoctosService {
    async getProfile(id, IdDocumento) {
        return await DoctosModel.get(id, IdDocumento);
    }

    async getDocumentsByUser(userId) {
        return await DoctosModel.getAll(userId);
    }

    async saveDocument(documentData) {
        return await DoctosModel.save(documentData);
    }

    async updateDocument(documentData) {
        return await DoctosModel.update(documentData);
    }

    async deleteDocument(userId, IdDocumento) {
        return await DoctosModel.delete(userId, IdDocumento);
    }

    async getExpedientesByDormitorio(IdDocumento) {
        return await DoctosModel.getExpedientesByDormitorio(IdDocumento);
    }

    async getArchivosByAlumno(dormitorio, nombre, apellidos) {
        return await DoctosModel.getArchivosByAlumno(dormitorio, nombre, apellidos);
    }
}

export default new DoctosService();
