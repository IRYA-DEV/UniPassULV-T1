import express from 'express';
import cors from 'cors';
import tutorsRoutes from "./routes/tutor.routes.js";
import usersRoutes from "./routes/user.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import doctosRoutes from "./routes/doctos.routes.js";
import registerRoutes from "./routes/resgister.routes.js";
import autorizaRoutes from "./routes/authorize.routes.js";
import morgan from 'morgan';


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('public'));

app.use(tutorsRoutes);

app.use(usersRoutes);

app.use(permissionRoutes);

app.use(doctosRoutes);

app.use(registerRoutes);

app.use(autorizaRoutes);

export default app;
