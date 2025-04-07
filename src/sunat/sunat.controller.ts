import { SunatService } from '@/sunat/sunat.service';
import { Controller, Get } from '@nestjs/common';

@Controller('sunat')
export class SunatController {
  constructor(private readonly sunatService: SunatService) {}

  @Get('validar-usuario')
  async validarUsuario() {
    // Llamamos al servicio para validar las credenciales
    const respuesta = await this.sunatService.validarUsuarioSecundario();
    return respuesta;
  }
}
