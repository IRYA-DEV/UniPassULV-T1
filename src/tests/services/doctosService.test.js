import { jest } from "@jest/globals";
import DoctosService from "../../services/doctos.service.js";
import { DoctosModel, ExpedientesModel } from "../../models/doctos.model.js";



jest.mock("../../models/doctos.model.js", () => ({
    DoctosModel: {
      get: jest.fn(),
      getAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }));
  
  
  

describe("Pruebas unitarias para DoctosService", () => {
    test("Debe retornar el perfil del documento", async () => {
        const mockData = { IdDocumento: 1, Archivo: "test.pdf" };
        DoctosModel.get.mockResolvedValueOnce(mockData);


        const result = await DoctosService.getProfile(1, 1);
        expect(result).toEqual(mockData);
        expect(DoctosModel.get).toHaveBeenCalledWith(1, 1);
    });

    test("Debe guardar un documento correctamente", async () => {
        const mockData = { IdDocumento: 1, Archivo: "/uploads/file.pdf" };
        DoctosModel.save.mockResolvedValue(mockData);

        const result = await DoctosService.saveDocument(mockData);
        expect(result).toEqual(mockData);
        expect(DoctosModel.save).toHaveBeenCalledWith(mockData);
    });

    test("Debe lanzar un error si el documento no existe", async () => {
        DoctosModel.get.mockResolvedValue(null);

        await expect(DoctosService.getProfile(1, 999)).rejects.toThrow();
    });
});
