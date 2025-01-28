import { getConnection } from "../configs/connectionDB.js";
import DoctosModel from '../models/doctos.model.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import sql from 'mssql';
import * as fs from 'fs';
import path from "path";

export const getProfile = async (req, res) => {
    try {
        const result = await DoctosModel.getDocumentFromDB(req.params.id, req.query.IdDocumento);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Archivo no encontrado" });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send(error.message);
    }
};

export const getDocumentsByUser = async (req, res) => {
    try {
        const userId = req.params.Id;
        const result = await DoctosModel.getDocumentsByUserId(userId);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron archivos para el usuario" });
        }
        return res.json(result.recordset);
    } catch (error) {
        errorHandler(error, res);
    }
};

export const saveDocument = async (req, res) => {
    try {
        console.log('Archivo recibido:', req.file); // Verificar archivo
        console.log('Campos recibidos:', req.body); // Verificar campos
        if (!req.file) {
            return res.status(400).json({ message: "Archivo no cargado" });
        }
        const filePath = '/uploads/' + req.file.filename;

        const documentData = {
            IdDocumento: req.body.IdDocumento,
            Archivo: filePath,
            StatusDoctos: 'Adjunto',
            IdLogin: req.body.IdLogin
        };

        const result = await DoctosModel.saveDocument(documentData);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se puede guardar el archivo" });
        }
        return res.json({
            Id: result.recordset[0].IdDoctos,
            IdDocumento: documentData.IdDocumento,
            Archivo: documentData.Archivo,
            StatusDoctos: documentData.StatusDoctos,
            IdLogin: documentData.IdLogin
        });
    } catch (error) {
        errorHandler(error, res);
    }
};

export const uploadProfile = async (req, res) => {
    try {
        console.log('Archivo recibido:', req.file); // Verificar archivo
        console.log('Campos recibidos:', req.body); // Verificar campos
        if (!req.file) {
            return res.status(400).json({ message: "Archivo no cargado" });
        }
        const filePath = '/uploads/' + req.file.filename;

        const documentData = {
            IdDocumento: req.body.IdDocumento,
            Archivo: filePath,
            IdLogin: req.body.IdLogin
        };

        const updateResult = await DoctosModel.updateDocument(documentData);
        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No se puede actualizar el archivo" });
        }

        const updatedRecord = await DoctosModel.getDocumentFromDB(documentData.IdDocumento, documentData.IdLogin);
        return res.json(updatedRecord.recordset[0]);
    } catch (error) {
        errorHandler(error, res);
    }
};

export const deleteFileDoc = async (req, res) => {
    try {
        const filePath = await DocumentModel.getDocumentFilePath(req.params.Id, req.body.IdDocumento);

        // Primero intentar eliminar el archivo físico
        fs.unlinkSync(path.join('./public', filePath));

        // Luego eliminar el registro en la base de datos
        const deleteResult = await DocumentModel.deleteDocument(req.params.Id, req.body.IdDocumento);
        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.status(200).json({ message: "DATO ELIMINADO" });
    } catch (error) {
        errorHandler(error, res);
    }
};

export const getExpedientesAlumnos = async (req, res) => {
    try {
        const IdDormitorio = req.params.IdDormi;
        const result = await StudentModel.getExpedientesByDormitorio(IdDormitorio);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron expedientes" });
        }
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en el servidor:', error);
        errorHandler(error, res);
    }
};
// //////////////////////////////////////
export const getArchivosAlumno = async (req, res) => {
    console.log(req.params);
    try {
        const { Dormitorio, Nombre, Apellidos } = req.params;
        if (!Dormitorio || !Nombre || !Apellidos) {
            return res.status(400).json({ message: "Faltan parámetros en la solicitud" });
        }

        const result = await StudentModel.getArchivosByAlumno(Dormitorio, Nombre, Apellidos);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron expedientes para el alumno especificado" });
        }
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en el servidor:', error);
        errorHandler(error, res);
    }
};

export const getArchivosAlumnoByDate = async (req, res) => {
    console.log(req.params, req.query);
    try {
        const { Dormitorio, Nombre, Apellidos } = req.params;
        const { fechaInicio, fechaFin } = req.query;
        const result = await StudentModel.getArchivosByAlumnoAndDate(Dormitorio, Nombre, Apellidos, fechaInicio, fechaFin);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron expedientes en las fechas especificadas" });
        }
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en el servidor:', error);
        errorHandler(error, res);
    }
};