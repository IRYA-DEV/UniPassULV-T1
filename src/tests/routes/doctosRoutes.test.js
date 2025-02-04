import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js"; // Importa tu app Express
import DoctosService from "../../services/doctos.service.js";

jest.mock("../../services/doctos.service.js");

describe("Pruebas de integración para rutas de documentos", () => {
    test("GET /doctos/:Id - Debe retornar documentos de usuario", async () => {
        const mockData = [{ IdDocumento: 1, Archivo: "/uploads/file.pdf" }];
        DoctosService.getDocumentsByUser.mockResolvedValue(mockData);

        const response = await request(app).get("/doctos/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(DoctosService.getDocumentsByUser).toHaveBeenCalledWith("1");
    });

    test("POST /doctosMul - Debe guardar un documento", async () => {
        const mockData = { IdDocumento: 1, Archivo: "/uploads/file.pdf" };
        DoctosService.saveDocument.mockResolvedValue(mockData);

        const response = await request(app)
            .post("/doctosMul")
            .attach("Archivo", Buffer.from("test file"), "file.pdf")
            .field("IdDocumento", "1")
            .field("IdLogin", "2");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(DoctosService.saveDocument).toHaveBeenCalled();
    });

    test("DELETE /doctosMul/:Id - Debe eliminar un documento", async () => {
        DoctosService.deleteDocument.mockResolvedValue({ rowsAffected: [1] });

        const response = await request(app).delete("/doctosMul/1").send({ IdDocumento: 2 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("DATO ELIMINADO");
        expect(DoctosService.deleteDocument).toHaveBeenCalledWith("1", 2);
    });

    test("GET /getExpediente/:IdDormi - Debe retornar expedientes", async () => {
        const mockData = [{ IdExpediente: 1, Nombre: "Alumno A" }];
        DoctosService.getExpedientesByDormitorio.mockResolvedValue(mockData);

        const response = await request(app).get("/getExpediente/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(DoctosService.getExpedientesByDormitorio).toHaveBeenCalledWith("1");
    });
});
