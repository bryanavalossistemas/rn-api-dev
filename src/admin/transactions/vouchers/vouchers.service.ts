import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class VouchersService {
  constructor(
    @InjectRepository(Voucher)
    private readonly vouchersRepository: Repository<Voucher>,
  ) {}

  async save(entity: DeepPartial<Voucher>) {
    return await this.vouchersRepository.save(entity);
  }

  async remove(id: Voucher['id']) {
    const result = await this.vouchersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return { message: 'Comprobante eliminado correctamente' };
  }

  async getNextVoucherNumberByLast(type: Voucher['type'], documentType: Voucher['documentType']): Promise<string> {
    const lastVoucher = await this.vouchersRepository.findOne({
      where: { type, documentType },
      order: { number: 'DESC' },
    });

    let nextNumber = 1;
    if (lastVoucher && lastVoucher.number) {
      const lastNumberStr = lastVoucher.number;
      const lastNumberInt = parseInt(lastNumberStr, 10); // Convertir a entero
      if (!isNaN(lastNumberInt)) {
        nextNumber = lastNumberInt + 1;
      }
    }
    return nextNumber.toString().padStart(8, '0'); // Formatear de vuelta a string
  }

  getVoucherSerie(documentType: Voucher['documentType']): string {
    switch (documentType) {
      case 'Factura':
        return 'F001';
      case 'Boleta':
        return 'B001';
      default:
        throw new BadRequestException(`Tipo de documento no soportado: ${documentType}`);
    }
  }
}
