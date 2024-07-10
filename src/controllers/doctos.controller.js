import { getConnection } from "../database/connection.js";
import sql from 'mssql'
import cloudinary from "../config.js";


export const getDocuments = async (req, res) => {
    const pool = await getConnection();
    const result = await pool
        .request()
        .query('SELECT * FROM Doctos');
    res.json(result.recordset);
};

export const getDocument = async (req, res) => {
    

    const pool = await getConnection();
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Doctos WHERE IdUser = @id');
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Archivo no encontrado"});
    }
    return res.json(result.recordset);
}

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

export const deleteDocument = async (req,res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("Id", sql.Int, req.params.Id)
        .input("IdDoctos", sql.Int, req.body.IdDoctos)
        .query("DELETE FROM Doctos WHERE IdUser = @IdUser AND IdDoctos = @IdDoctos");  

    console.log(result)
    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado"});
    }
    return res.json({ message: "Dato Eliminado"});
};