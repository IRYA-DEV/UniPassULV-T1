import { DoctosModel, ExpedientesModel } from "../models/doctos.model.js";

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

    async getExpedientesByDormitorio(IdDormitorio) {
        return await ExpedientesModel.getExpedientesByDormitorio(IdDormitorio);
    }

    async getArchivosByAlumno(Dormitorio, Nombre, Apellidos) {
        return await ExpedientesModel.getArchivosByAlumno(Dormitorio, Nombre, Apellidos);
    }

    async getArchivosByAlumnoAndDate(Dormitorio, Nombre, Apellidos) {
        return await ExpedientesModel.getArchivosByAlumnoAndDate(Dormitorio, Nombre, Apellidos);
    }
}

export default new DoctosService();
