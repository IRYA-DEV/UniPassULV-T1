import DoctosModel from '../models/doctos.model.js';
import DoctosService from "../services/doctos.service.js";
import { errorHandler } from '../middlewares/errorHandler.js';
import * as fs from 'fs';
import path from "path";

export const getProfile = async (req, res) => {
    try {
        const result = await DoctosService.getProfile(req.params.id, req.query.IdDocumento);
        //console.log(result);
        if (!result) {
            return res.status(404).json({ message: "Archivo no encontrado" });
        }
        return res.json(result);
    } catch (error) {
        errorHandler(error, res);
    }
};

export const getDocumentsByUser = async (req, res) => {
    try {
        const userId = req.params.Id;
        const result = await DoctosService.getDocumentsByUser(userId);
        if (!result) {
            return res.status(404).json({ message: "No se encontraron archivos para el usuario" });
        }
        return res.json(result);
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

        const result = await DoctosService.saveDocument(documentData);
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

        const updateResult = await DoctosService.updateDocument(documentData);
        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "No se puede actualizar el archivo" });
        }

        const updatedRecord = await DoctosModel.get(documentData.IdDocumento, documentData.IdLogin);
        return res.json(updatedRecord.recordset[0]);
    } catch (error) {
        errorHandler(error, res);
    }
};

export const deleteFileDoc = async (req, res) => {
    try {
        const filePath = await DoctosService.getProfile(req.params.Id, req.body.IdDocumento);

        // Primero intentar eliminar el archivo físico
        fs.unlinkSync(path.join('./public', filePath));

        // Luego eliminar el registro en la base de datos
        const deleteResult = await DoctosService.deleteDocument(req.params.Id, req.body.IdDocumento);
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
        const result = await DoctosService.getExpedientesByDormitorio(IdDormitorio);
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

        const result = await DoctosService.getDocumentsByUser(Dormitorio, Nombre, Apellidos);
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
        const result = await DoctosModel.getArchivosByAlumnoAndDate(Dormitorio, Nombre, Apellidos, fechaInicio, fechaFin);
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se encontraron expedientes en las fechas especificadas" });
        }
        return res.json(result.recordset);
    } catch (error) {
        console.error('Error en el servidor:', error);
        errorHandler(error, res);
    }
};
