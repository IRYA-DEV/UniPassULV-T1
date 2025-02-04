import sql from 'mssql';
import { getConnection } from "../configs/connectionDB.js";
import { QuerysDoctos } from "../querys/doctos.query.js";
import { BaseDocumentModel } from "./BaseDocument.model.js";

class DoctosModel extends BaseDocumentModel{
    static async get(id, IdDocumento) {
        let pool = await getConnection();
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('IdDocumento', sql.Int, IdDocumento)
                .query(QuerysDoctos.getProfile);
            console.log(result);
            return result.recordset[0];
        } finally {
            if (pool) await pool.close();
        }
    }

    static async getAll(userId) {
        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input('Id', sql.Int, userId)
                .query(QuerysDoctos.DocumentsByUser);
            return result.recordset;
        } finally {
            await pool.close();
        }
    }

    static async save(documentData) {
        const pool = await getConnection();
        try {
            const { IdDocumento, Archivo, StatusDoctos, IdLogin } = documentData;
            const result = await pool.request()
                .input('IdDocumento', sql.Int, IdDocumento)
                .input('Archivo', sql.VarChar, Archivo)
                .input('StatusDoctos', sql.VarChar, StatusDoctos)
                .input('IdLogin', sql.Int, IdLogin)
                .query(QuerysDoctos.guardarDocument);
            return result.recordset[0];
        } finally {
            await pool.close();
        }
    }

    static async update(documentData) {
        const pool = await getConnection();
        try {
            const { IdDocumento, Archivo, IdLogin } = documentData;
            const result = await pool.request()
                .input('IdDocumento', sql.Int, IdDocumento)
                .input('Archivo', sql.VarChar, Archivo)
                .input('IdLogin', sql.Int, IdLogin)
                .query(QuerysDoctos.cambiarPerfil);
            return result;
        } finally {
            await pool.close();
        }
    }

    static async delete(UserId, IdDocumento) {
        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input("Id", sql.Int, UserId)
                .input("IdDocumento", sql.Int, IdDocumento)
                .query(QuerysDoctos.eliminarDocto);
            return result;
        } finally {
            await pool.close();
        }
    }

    static async getExpedientesByDormitorio(IdDormitorio) {
        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input('IdDormitorio', sql.Int, IdDormitorio)
                .query(QuerysDoctos.expedientesAlumnos);
            return result;
        } finally {
            await pool.close();
        }
    }

    static async getArchivosByAlumno(dormitorio, nombre, apellidos) {
        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input('Dormitorio', sql.Int, dormitorio)
                .input('Nombre', sql.VarChar, nombre)
                .input('Apellidos', sql.VarChar, apellidos)
                .query(QuerysDoctos.archivosAlumno);
            return result;
        } finally {
            await pool.close();
        }
    }

    static async getArchivosByAlumnoAndDate(dormitorio, nombre, apellidos, fechaInicio, fechaFin) {
        const pool = await getConnection();
        try {
            const result = await pool.request()
                .input('Dormitorio', sql.Int, dormitorio)
                .input('Nombre', sql.VarChar, nombre)
                .input('Apellidos', sql.VarChar, apellidos)
                .input('FechaInicio', sql.Date, fechaInicio)
                .input('FechaFin', sql.Date, fechaFin)
                .query(QuerysDoctos.archivosAlumnoAndDate);
            return result;
        } finally {
            await pool.close();
        }
    }
}

export default DoctosModel;
