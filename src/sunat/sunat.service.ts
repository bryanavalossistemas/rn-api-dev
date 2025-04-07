import { Injectable } from '@nestjs/common';
import * as soap from 'soap';  // Librería para SOAP

@Injectable()
export class SunatService {
  async validarUsuarioSecundario() {
    // URL del WSDL de SUNAT para el entorno de pruebas
    const urlWsdl = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService?wsdl';

    // Tus credenciales de SUNAT (RUC, usuario y clave del usuario secundario)
    const ruc = '20600007522'; // RUC de tu empresa
    const usuarioSecundario = 'FACTSYS1'; // El usuario SOL secundario
    const clave = 'U9w765Px'; // Contraseña del usuario SOL secundario

    // Los parámetros que vamos a enviarle a SUNAT
    const args = {
      ruc: ruc,  // RUC de tu empresa
      usuario: usuarioSecundario, // Usuario SOL secundario
      clave: clave // Contraseña del usuario SOL
    };

    // Configuración de seguridad para enviar las credenciales de SUNAT
    const wsSecurity = new soap.WSSecurity(`${ruc}${usuarioSecundario}`, clave);

    return new Promise((resolve, reject) => {
      // Creamos el cliente SOAP para conectarnos a SUNAT
      soap.createClient(urlWsdl, {}, (err, client) => {
        if (err) return reject(err); // Si hay un error al crear el cliente, lo rechazamos

        // Configuramos la seguridad con las credenciales
        client.setSecurity(wsSecurity);

        // Llamamos al método 'getStatus' para verificar el estado
        client.getStatus(args, (err, result) => {
          if (err) {
            console.error('Error al validar el usuario con SUNAT', err.body || err);
            return reject(err); // Si hay un error, lo rechazamos
          }

          console.log('Respuesta de SUNAT:', result); // Aquí verás la respuesta de SUNAT
          resolve(result); // Si todo está bien, resolvemos la promesa con el resultado
        });
      });
    });
  }
}
