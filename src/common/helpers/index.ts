import { Voucher } from '@/admin/transactions/vouchers/entities/voucher.entity';

export async function delay(seconds: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function generateVoucherSerie(documentType: Voucher['documentType']) {
  if (documentType === 'Factura') {
    return 'F001';
  } else if (documentType === 'Boleta') {
    return 'B001';
  }
}

export function generateVoucherNumber(number: number) {
  return number.toString().padStart(8, '0');
}
