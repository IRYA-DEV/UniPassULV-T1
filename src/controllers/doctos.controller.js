import { getConnection } from "../database/connection.js";
import sql from 'mssql';
import * as fs from 'fs';
import path from "path";
// Implementación con cloudinary
import cloudinary from "../config.js";

export const getProfile = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('id', sql.Int, req.params.id)
            .input('IdDocumento', sql.Int, req.query.IdDocumento) // Cambio de body a query
            .query('SELECT Archivo FROM Doctos WHERE IdLogin = @id AND IdDocumento = @IdDocumento');
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Archivo no encontrado" });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};

export const getDocumentsByUser = async (req, res) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool.request()
            .input('Id', sql.Int, req.params.Id)
            .query('SELECT * FROM Doctos WHERE IdLogin = @Id');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron archivos para el usuario" });
        }
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};

export const saveDocument = async (req, res) => {
    let pool;
    try {
        console.log('Archivo recibido:', req.file); // Verificar archivo
        console.log('Campos recibidos:', req.body); // Verificar campos
        if (!req.file) {
            return res.status(400).json({ message: "Archivo no cargado" });
        }
        const filePath = '/uploads/' + req.file.filename;

        pool = await getConnection();
        const result = await pool.request()
            .input('IdDocumento', sql.Int, req.body.IdDocumento)
            .input('Archivo', sql.VarChar, filePath)
            .input('StatusDoctos', sql.VarChar, 'Adjunto')
            .input('IdLogin', sql.Int, req.body.IdLogin)
            .query('INSERT INTO Doctos (IdDocumento, Archivo, StatusDoctos, IdLogin) VALUES (@IdDocumento, @Archivo, @StatusDoctos, @IdLogin); SELECT SCOPE_IDENTITY() AS IdDoctos');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se puede guardar el archivo" });
        }
        return res.json({
            Id: result.recordset[0].IdDoctos,
            IdDocumento: req.body.IdDocumento,
            Archivo: filePath,
            StatusDoctos: 'Adjunto',
            IdLogin: req.body.IdLogin
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ message: 'Error en el proceso de carga' });
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};

export const deleteFileDoc = async (req, res) => {
    let pool;
    try {
        await deleteFile(req.params.Id, req.body.IdDocumento);
        pool = await getConnection();
        const deleteResult = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .input("IdDocumento", sql.Int, req.body.IdDocumento)
            .query("DELETE FROM Doctos WHERE IdLogin = @Id AND IdDocumento = @IdDocumento");

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.status(200).json({ message: "DATO ELIMINADO" });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ message: 'Error en el proceso de eliminación' });
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};

const deleteFile = async (UserId, IdDocumento) => {
    let pool;
    try {
        pool = await getConnection();
        const result = await pool
            .request()
            .input('Id', sql.Int, UserId)
            .input("IdDocumento", sql.Int, IdDocumento)
            .query('SELECT Archivo FROM Doctos WHERE IdLogin = @Id AND IdDocumento = @IdDocumento');

        if (result.recordset.length === 0) {
            throw new Error('Archivo no encontrado en la base de datos');
        }

        const Archivo = result.recordset[0].Archivo;
        if (typeof Archivo !== 'string') {
            throw new Error('El valor de Archivo no es una cadena de texto');
        }

        fs.unlinkSync('./public/' + Archivo);
    } catch (error) {
        console.error('Error eliminando archivo:', error);
        throw error; // Re-lanzar el error para ser capturado en la función que llama
    } finally {
        if (pool) {
            try {
                await pool.close();
            } catch (closeError) {
                console.error('Error al cerrar la conexión a la base de datos:', closeError);
            }
        }
    }
};
