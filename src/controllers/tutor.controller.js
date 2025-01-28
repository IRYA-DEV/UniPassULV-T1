import { getConnection } from "../configs/connectionDB.js";
import sql from 'mssql'

export const getTutores = async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM Tutors')
    res.json(result.recordset)
};

export const getTutor = async (req, res) => {
    console.log(req.params.Id);

    const pool = await getConnection();
    const result = await pool
        .request()
        .input("Id", sql.Int, req.params.Id)
        .query("SELECT * FROM Tutors WHERE Id = @Id");

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado"});
    }
    return res.json(result.recordset[0]);
};

export const createTutor = async (req, res) => {
    console.log(req.body);
    const pool = await getConnection()
    const result = await pool
        .request()
        .input('Nombre', sql.VarChar, req.body.Nombre)
        .input('Telefono', sql.VarChar, req.body.Telefono)
        .input('Celular', sql.VarChar, req.body.Celular)
        .input('Direccion', sql.VarChar, req.body.Direccion)
        .input('Correo', sql.VarChar, req.body.Correo)
        .query('INSERT INTO Tutors (Nombre ,Telefono ,Celular , Direccion ,Correo) VALUES (@Nombre, @Telefono, @Celular, @Direccion, @Correo); SELECT SCOPE_IDENTITY() AS Id');
    console.log(result)
    res.json({
        Id: result.recordset[0].Id,
        Nombre: req.body.Nombre,
        Telefono: req.body.Telefono,
        Celular: req.body.Celular,
        Direccion: req.body.Direccion,
        Correo: req.body.Correo
    })
};

export const updateTutor = async (req,res) => {
    const pool = await getConnection();
    const result = await pool
    .request()
    .input("Id", sql.Int, req.params.Id)
    .input("Nombre", sql.VarChar, req.body.Nombre)
    .input("Telefono", sql.VarChar, req.body.Telefono)
    .input("Celular", sql.VarChar, req.body.Celular)
    .input("Direccion", sql.VarChar, req.body.Direccion)
    .input("Correo", sql.VarChar, req.body.Correo)
    .query("UPDATE Tutors SET Nombre = @Nombre, Telefono = @Telefono, Celular = @Celular, Direccion = @Direccion, Correo = @Correo WHERE Id = @Id")
    console.log(result);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado"});
    }
    res.json("Dato Actulizado");
};

export const deleteTutor = async (req,res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("Id", sql.Int, req.params.Id)
        .query("DELETE FROM Tutors WHERE Id = @Id");  

    console.log(result)
    if(result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Dato no encontrado"});
    }
    return res.json({ message: "Dato Eliminado"});
};
