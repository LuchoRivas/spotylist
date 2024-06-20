import app from './app';
import { port } from './config/config';

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
