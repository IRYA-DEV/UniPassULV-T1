const QuerysDoctos = {
    getProfile: 'SELECT Archivo FROM Doctos WHERE IdLogin = @id AND IdDocumento = @IdDocumento',
    DocumentsByUser: 'SELECT * FROM Doctos WHERE IdLogin = @Id',
    guardarDocument: `INSERT INTO Doctos (IdDocumento, Archivo, StatusDoctos, IdLogin) VALUES (@IdDocumento, @Archivo, @StatusDoctos, @IdLogin); SELECT SCOPE_IDENTITY() AS IdDoctos`,
    cambiarPerfil: 'UPDATE Doctos SET Archivo = @Archivo WHERE IdDocumento = @IdDocumento AND IdLogin = @IdLogin;',
    eliminarDocto: "DELETE FROM Doctos WHERE IdLogin = @Id AND IdDocumento = @IdDocumento",
    expedientesAlumnos: `SELECT DISTINCT LoginUniPass.Matricula, LoginUniPass.Nombre, LoginUniPass.Apellidos FROM Doctos INNER JOIN DocumentCatalog ON DocumentCatalog.IdDocument = Doctos.IdDocumento INNER JOIN LoginUniPass ON LoginUniPass.IdLogin = Doctos.IdLogin WHERE LoginUniPass.Dormitorio = @IdDormitorio AND LoginUniPass.TipoUser = 'ALUMNO'`,
    archivosAlumno: `SELECT Doctos.*, DocumentCatalog.* FROM Doctos INNER JOIN DocumentCatalog ON DocumentCatalog.IdDocument = Doctos.IdDocumento INNER JOIN LoginUniPass ON LoginUniPass.IdLogin = Doctos.IdLogin WHERE LoginUniPass.Dormitorio = @Dormitorio AND LoginUniPass.Nombre = @Nombre AND LoginUniPass.Apellidos = @Apellidos AND DocumentCatalog.Estado = 'Activo'`,
    archivosAlumnoAndDate: `
                    SELECT Doctos.*, DocumentCatalog.* 
                    FROM Doctos 
                    INNER JOIN DocumentCatalog ON DocumentCatalog.IdDocument = Doctos.IdDocumento
                    INNER JOIN LoginUniPass ON LoginUniPass.IdLogin = Doctos.IdLogin
                    WHERE LoginUniPass.Dormitorio = @Dormitorio 
                    AND LoginUniPass.Nombre = @Nombre 
                    AND LoginUniPass.Apellidos = @Apellidos
                    AND DocumentCatalog.Estado = 'Activo'
                    AND DocumentCatalog.Fecha BETWEEN @FechaInicio AND @FechaFin
                `,
};

export { QuerysDoctos };
