import { getConnection } from "../database/connection.js";
import sql from 'mssql';
import * as fs from 'fs';
import path from "path";
//Implemayacion con clodinary
import cloudinary from "../config.js";
import { Console } from "console";


//export const getDocuments = async (req, res) => {
//    const pool = await getConnection();
//    const result = await pool
//        .request()
//        .query('SELECT * FROM Doctos');
//    res.json(result.recordset);
//};
//
//export const getDocument = async (req, res) => {
//    
//
//    const pool = await getConnection();
//    const result = await pool
//        .request()
//        .input('id', sql.Int, req.params.id)
//        .query('SELECT * FROM Doctos WHERE IdUser = @id');
//    if (result.rowsAffected[0] === 0) {
//        return res.status(404).json({ message: "Archivo no encontrado"});
//    }
//    return res.json(result.recordset);
//}

export const getDocumentsByUser = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('Id', sql.Int, req.params.Id)
        .query('SELECT * FROM Doctos WHERE IdUser = @Id');
    if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No se encontraron archivos para el usuario" });
    }
    return res.json(result.recordset);
};

export const saveProfile = async (req, res) => {
    try {

        const file = req.file;
        const filePath = '/uploads/' + file.filename;

        const pool = await getConnection();
        const result = await pool.request()
        .input('IdDocumento', sql.Int, req.body.IdDocumento)
        .input('Archivo', sql.VarChar, filePath)
        .input('StatusDoctos', sql.VarChar, 'Adjunto')
        .input('IdUser', sql.Int, req.body.IdUser)
        .query('INSERT INTO Doctos (IdDocumento, Archivo, StatusDoctos, IdUser) VALUES (@IdDocumento, @Archivo, @StatusDoctos, @IdUser); SELECT SCOPE_IDENTITY() AS IdDoctos');
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "No se puede guardar el archivo" });
        }
        return res.json({
            Id: result.recordset[0].IdDoctos,
            IdDocumento: req.body.IdDocumento,
            Archivo: filePath,
            StatusDoctos: 'Adjunto',
            IdUser: req.body.IdUser
        });
    } catch (error) {
        
    }
}

export const deleteFileDoc = async (req, res) => {
    try {
        await deleteFile(req.params.Id, req.body.IdDocumento);
        const pool = await getConnection();
        const deleteResult = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .input("IdDocumento", sql.Int, req.body.IdDocumento)
            .query("DELETE FROM Doctos WHERE IdUser = @Id AND IdDocumento = @IdDocumento");

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }
        return res.status(200).json({ message: "DATO ELIMINADO" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el proceso de eliminación' });
    }
};

const deleteFile = async (UserId, IdDocumento) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('Id', sql.Int, UserId)
            .input("IdDocumento", sql.Int, IdDocumento)
            .query('SELECT Archivo FROM Doctos WHERE IdUser = @Id AND IdDocumento = @IdDocumento');

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
        throw error; // Re-throw the error to be caught in the calling function
    }
};

////////////////////////////////////////////////////////////////////////////////////////////

//Descartar Cloudinary
export const createDocument = async (req, res) => {
    try {
        // Subir archivo a Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ 
                resource_type: 'auto',
                folder: 'doctos'
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(req.file.buffer);
        });

        // Insertar en la base de datos
        const pool = await getConnection();
        const dbResult = await pool.request()
            .input('IdDocumento', sql.Int, req.body.IdDocumento)
            .input('Archivo', sql.VarChar, result.secure_url)
            .input('StatusDoctos', sql.VarChar, 'Adjunto')
            .input('IdUser', sql.Int, req.body.IdUser)
            .query('INSERT INTO Doctos (IdDocumento, Archivo, StatusDoctos, IdUser) VALUES (@IdDocumento, @Archivo, @StatusDoctos, @IdUser); SELECT SCOPE_IDENTITY() AS IdDoctos');
            
        console.log(result);
        res.json({
            Id: dbResult.recordset[0].IdDoctos,
            IdDocumento: req.body.IdDocumento,
            Archivo: result.secure_url,
            StatusDoctos: 'Adjunto',
            IdUser: req.body.IdUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al subir el archivo" });
    }
};


// Función para extraer el public_id de la URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
    try {
        const urlParts = url.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/'); // Captura los últimos dos segmentos de la URL
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ""); // Elimina la extensión del archivo
        return publicId;
    } catch (error) {
        console.error('Error extrayendo el public_id de la URL:', error);
        throw new Error('Error extrayendo el public_id');
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const pool = await getConnection();

        // Primero, obtenemos la URL del archivo almacenado en la base de datos
        const selectResult = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .input("IdDocumento", sql.Int, req.body.IdDocumento)
            .query("SELECT Archivo FROM Doctos WHERE IdUser = @Id AND IdDocumento = @IdDocumento");

        if (selectResult.recordset.length === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }

        const fileUrl = selectResult.recordset[0].Archivo;
        const publicId = extractPublicIdFromUrl(fileUrl);

        // Luego elimina el registro de la base de datos
        const deleteResult = await pool.request()
            .input("Id", sql.Int, req.params.Id)
            .input("IdDocumento", sql.Int, req.body.IdDocumento)
            .query("DELETE FROM Doctos WHERE IdUser = @Id AND IdDocumento = @IdDocumento");

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Dato no encontrado" });
        }

        // Por ultimo elimina el archivo de Cloudinary
        cloudinary.uploader.destroy(publicId, function(error, result) {
            if (error) {
                console.error('Error eliminando la imagen en Cloudinary:', error);
                return res.status(500).json({ message: 'Error eliminando la imagen en Cloudinary' });
            }

            console.log('Resultado de la eliminación en Cloudinary:', result);
            return res.json({ message: "Dato eliminado y archivo eliminado en Cloudinary" });
        });
    } catch (error) {
        console.error('Error en el proceso de eliminación:', error);
        return res.status(500).json({ message: 'Error en el proceso de eliminación' });
    }
};
