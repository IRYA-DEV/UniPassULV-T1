import { jest } from "@jest/globals";
import { deleteFileDoc } from "../../controllers/doctos.controller.js";
import DoctosService from "../../services/doctos.service.js";
import * as fs from "fs";

jest.mock("../../services/doctos.service.js", () => ({
    getProfile: jest.fn(),
    getDocumentsByUser: jest.fn(),
    saveDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    getExpedientesByDormitorio: jest.fn(),
    getArchivosByAlumno: jest.fn(),
    getArchivosByAlumnoAndDate: jest.fn(),
  }));
  
  
jest.mock("fs", () => ({
    unlinkSync: jest.fn(),
}));

describe("Pruebas unitarias para deleteFileDoc", () => {
    const req = { params: { Id: "1" }, body: { IdDocumento: "2" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    test("Debe eliminar un documento correctamente", async () => {
        DoctosService.getProfile.mockResolvedValueOnce("/uploads/file.pdf");
        DoctosService.deleteDocument.mockResolvedValue({ rowsAffected: [1] });

        await deleteFileDoc(req, res);

        expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining("/uploads/file.pdf"));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "DATO ELIMINADO" });
    });

    test("Debe devolver error si el documento no existe", async () => {
        DoctosService.getProfile.mockResolvedValue(null);

        await deleteFileDoc(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Dato no encontrado" });
    });
});
