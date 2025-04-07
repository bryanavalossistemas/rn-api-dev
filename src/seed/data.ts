import { Brand } from '@/admin/inventory/brands/entities/brand.entity';
import { Category } from '@/admin/inventory/categories/entities/category.entity';
import { MeasurementUnit } from '@/admin/inventory/measurement-units/entities/measurement-unit.entity';
import { Product } from '@/admin/inventory/products/entities/product.entity';
import { Customer } from '@/admin/transactions/customers/entities/customer.entity';
import { Supplier } from '@/admin/transactions/suppliers/entities/supplier.entity';
import { Profile } from '@/auth/modules/profiles/entities/profile.entity';
import { User } from '@/auth/modules/users/entities/user.entity';
import { DeepPartial } from 'typeorm';

export const usersData: DeepPartial<User[]> = [
  {
    email: 'bryanavalossistemas@gmail.com',
    password: '$2b$10$rCvl1U70EZj/JJbCPpA5Y.88FYbhtJNQMorwdif4iD4po.5W8gVoi',
    isEmailVerified: true,
    role: 'admin',
  },
];

export const profilesData: DeepPartial<Profile[]> = [
  {
    name: 'Bryan Avalos',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocIKcuNAMPV1XgnHpASd_6MnC-6DIduSdITEi9V_hhpKvATUyDQ=s96-c',
    user: { id: 1 },
  },
];

export const categoriesData: DeepPartial<Category[]> = [
  {
    id: 1,
    name: 'Harinas',
  },
  {
    id: 2,
    name: 'Lácteos',
  },
  {
    id: 3,
    name: 'Carnes',
  },
  {
    id: 4,
    name: 'Frutas y Verduras',
  },
  {
    id: 5,
    name: 'Bebidas',
  },
  {
    id: 6,
    name: 'Snacks',
  },
  {
    id: 7,
    name: 'Conservas',
  },
  {
    id: 8,
    name: 'Aceites y Vinagres',
  },
  {
    id: 9,
    name: 'Condimentos y Especias',
  },
  {
    id: 10,
    name: 'Panadería y Repostería',
  },
  {
    id: 11,
    name: 'Cereales y Granos',
  },
  {
    id: 12,
    name: 'Productos de Limpieza',
  },
  {
    id: 13,
    name: 'Cuidado Personal',
  },
  {
    id: 14,
    name: 'Congelados',
  },
  {
    id: 15,
    name: 'Alimentos para Mascotas',
  },
  {
    id: 16,
    name: 'Arroces',
    createdAt: '2025-07-25T22:07:00',
  },
];

export const brandsData: DeepPartial<Brand[]> = [
  {
    id: 1,
    name: 'Anita',
  },
  {
    id: 2,
    name: 'Gloria',
  },
  {
    id: 3,
    name: 'Laive',
  },
  {
    id: 4,
    name: 'Nestlé Perú',
  },
  {
    id: 5,
    name: 'Alicorp',
  },
  {
    id: 6,
    name: 'Molitalia',
  },
  {
    id: 7,
    name: 'San Fernando',
  },
  {
    id: 8,
    name: 'Costa',
  },
  {
    id: 9,
    name: 'Pilsen Callao',
  },
  {
    id: 10,
    name: 'Backus',
  },
  {
    id: 11,
    name: 'Cusqueña',
  },
  {
    id: 12,
    name: 'Inka Crops',
  },
  {
    id: 13,
    name: 'Tottus',
  },
  {
    id: 14,
    name: 'Don Vittorio',
  },
  {
    id: 15,
    name: 'La Ibérica',
  },
];

export const suppliersData: DeepPartial<Supplier[]> = [
  {
    id: 1,
    name: 'Alicorp S.A.A',
    documentType: 'RUC',
    documentNumber: '20100055237',
  },
  {
    id: 2,
    name: 'Bryan Avalos Loa y Pardo',
    documentType: 'DNI',
    documentNumber: '75013015',
  },
  {
    id: 3,
    name: 'Gloria S.A.',
    documentType: 'RUC',
    documentNumber: '20100012345',
  },
  {
    id: 4,
    name: 'María López Pérez',
    documentType: 'DNI',
    documentNumber: '45678923',
  },
  {
    id: 5,
    name: 'San Fernando S.A.',
    documentType: 'RUC',
    documentNumber: '20100067890',
  },
  {
    id: 6,
    name: 'Carlos Gutiérrez Rojas',
    documentType: 'DNI',
    documentNumber: '87654321',
  },
  {
    id: 7,
    name: 'Molitalia S.A.',
    documentType: 'RUC',
    documentNumber: '20100098765',
  },
  {
    id: 8,
    name: 'Lucía Mendoza Torres',
    documentType: 'DNI',
    documentNumber: '23456789',
  },
  {
    id: 9,
    name: 'Laive S.A.',
    documentType: 'RUC',
    documentNumber: '20100054321',
  },
  {
    id: 10,
    name: 'Jorge Díaz Salazar',
    documentType: 'DNI',
    documentNumber: '76543210',
  },
  {
    id: 11,
    name: 'Nestlé Perú S.A.',
    documentType: 'RUC',
    documentNumber: '20100011223',
  },
  {
    id: 12,
    name: 'Ana Castillo Ruiz',
    documentType: 'DNI',
    documentNumber: '32165498',
  },
  {
    id: 13,
    name: 'Inka Crops S.A.',
    documentType: 'RUC',
    documentNumber: '20100033445',
  },
  {
    id: 14,
    name: 'Pedro Vargas Morales',
    documentType: 'DNI',
    documentNumber: '98765432',
  },
  {
    id: 15,
    name: 'Tottus S.A.',
    documentType: 'RUC',
    documentNumber: '20100055667',
  },
  {
    id: 16,
    name: 'Representaciones Nataly S.A.C Un Nombre Super Largo',
    documentType: 'RUC',
    documentNumber: '20100055666',
  },
];

export const customersData: DeepPartial<Customer[]> = [
  {
    id: 1,
    name: 'Alicorp S.A.A',
    documentType: 'RUC',
    documentNumber: '20100055237',
  },
  {
    id: 2,
    name: 'Bryan Avalos Loa y Pardo Jesus Un Poco Mas Largo',
    documentType: 'DNI',
    documentNumber: '75013015',
  },
  {
    id: 3,
    name: 'Gloria S.A.',
    documentType: 'RUC',
    documentNumber: '20100012345',
  },
  {
    id: 4,
    name: 'María López Pérez',
    documentType: 'DNI',
    documentNumber: '45678923',
  },
  {
    id: 5,
    name: 'San Fernando S.A.',
    documentType: 'RUC',
    documentNumber: '20100067890',
  },
  {
    id: 6,
    name: 'Carlos Gutiérrez Rojas',
    documentType: 'DNI',
    documentNumber: '87654321',
  },
  {
    id: 7,
    name: 'Molitalia S.A.',
    documentType: 'RUC',
    documentNumber: '20100098765',
  },
  {
    id: 8,
    name: 'Lucía Mendoza Torres',
    documentType: 'DNI',
    documentNumber: '23456789',
  },
  {
    id: 9,
    name: 'Laive S.A.',
    documentType: 'RUC',
    documentNumber: '20100054321',
  },
  {
    id: 10,
    name: 'Jorge Díaz Salazar',
    documentType: 'DNI',
    documentNumber: '76543210',
  },
  {
    id: 11,
    name: 'Nestlé Perú S.A.',
    documentType: 'RUC',
    documentNumber: '20100011223',
  },
  {
    id: 12,
    name: 'Ana Castillo Ruiz',
    documentType: 'DNI',
    documentNumber: '32165498',
  },
  {
    id: 13,
    name: 'Inka Crops S.A.',
    documentType: 'RUC',
    documentNumber: '20100033445',
  },
  {
    id: 14,
    name: 'Pedro Vargas Morales',
    documentType: 'DNI',
    documentNumber: '98765432',
  },
  {
    id: 15,
    name: 'Tottus S.A.',
    documentType: 'RUC',
    documentNumber: '20100055667',
  },
  {
    id: 16,
    name: 'Representacions Nataly S.A.C Con Un Nombre Super Largo jdsnfoasdoifnasdofionadsoifasodifdsa',
    documentType: 'RUC',
    documentNumber: '20100055661',
  },
];

export const measurementUnitsData: DeepPartial<MeasurementUnit[]> = [
  {
    name: 'kilogramo',
    prefix: 'kg',
  },
  {
    name: 'gramo',
    prefix: 'g',
  },
  {
    name: 'litro',
    prefix: 'L',
  },
  {
    name: 'mililitro',
    prefix: 'ml',
  },
  {
    name: 'unidad',
    prefix: 'ud',
  },
  {
    name: 'paquete',
    prefix: 'pqt',
  },
  {
    name: 'docena',
    prefix: 'dz',
  },
  {
    name: 'metro',
    prefix: 'm',
  },
  {
    name: 'centímetro',
    prefix: 'cm',
  },
  {
    name: 'libra',
    prefix: 'lb',
  },
];

export const productsData: DeepPartial<Product[]> = [
  {
    id: 1,
    name: 'Harina Anita Pastelera x 50kg',
    description: 'Harina de la marca Anita. Ideal para panadería y repostería.',
    barCode: '7801234567897',
    showInEcommerce: true,
    sku: 'HAR-001',
    stock: 0,
    salePrice: 140,
    ecommerceSalePrice: 150,
    ecommercePercentageDiscount: 10,
    measurementUnitId: 1, // kg
    measurementQuantity: 50,
    categoryId: 1, // Harinas
    brandId: 1,
  },
  {
    id: 2,
    name: 'Leche Gloria Entera x 1L',
    description: 'Leche evaporada Gloria, clásica y nutritiva.',
    barCode: '7801234567898',
    showInEcommerce: true,
    sku: 'LEC-001',
    stock: 50,
    salePrice: 6,
    ecommerceSalePrice: 6.5,
    ecommercePercentageDiscount: 0,
    measurementUnitId: 3, // L
    measurementQuantity: 1,
    categoryId: 2, // Lácteos
    brandId: 2,
  },
  {
    id: 3,
    name: 'Pollo San Fernando x 1kg',
    description: 'Pollo fresco de la marca San Fernando.',
    barCode: '7801234567899',
    showInEcommerce: true,
    sku: 'CAR-001',
    stock: 15,
    salePrice: 16,
    ecommerceSalePrice: 17,
    ecommercePercentageDiscount: 5,
    measurementUnitId: 1, // kg
    measurementQuantity: 1,
    categoryId: 3, // Carnes
    brandId: 3,
  },
  {
    id: 4,
    name: 'Palta Hass x 1kg',
    description: 'Paltas frescas de la variedad Hass.',
    barCode: '7801234567900',
    showInEcommerce: true,
    sku: 'FRU-001',
    stock: 30,
    salePrice: 12,
    ecommerceSalePrice: 13,
    ecommercePercentageDiscount: 0,
    measurementUnitId: 1, // kg
    measurementQuantity: 1,
    categoryId: 4, // Frutas y Verduras
    brandId: null,
  },
  {
    id: 5,
    name: 'Inca Kola x 3L',
    description: 'Refresco peruano de sabor único.',
    barCode: '7801234567901',
    showInEcommerce: true,
    sku: 'BEB-001',
    stock: 25,
    salePrice: 10,
    ecommerceSalePrice: 11,
    ecommercePercentageDiscount: 0,
    measurementUnitId: 3, // L
    measurementQuantity: 3,
    categoryId: 5, // Bebidas
    brandId: 4,
  },
  {
    id: 6,
    name: 'Chips Ahoy! x 90g',
    description: 'Galletas con chispas de chocolate.',
    barCode: '7801234567902',
    showInEcommerce: true,
    sku: 'SNK-001',
    stock: 40,
    salePrice: 5,
    ecommerceSalePrice: 5.5,
    ecommercePercentageDiscount: 10,
    measurementUnitId: 2, // g
    measurementQuantity: 90,
    categoryId: 6, // Snacks
    brandId: 5,
  },
  {
    id: 7,
    name: 'Atún Florida x 170g',
    description: 'Lomitos de atún en agua.',
    barCode: '7801234567903',
    showInEcommerce: true,
    sku: 'CON-001',
    stock: 35,
    salePrice: 8,
    ecommerceSalePrice: 8.5,
    ecommercePercentageDiscount: 0,
    measurementUnitId: 2, // g
    measurementQuantity: 170,
    categoryId: 7, // Conservas
    brandId: 6,
  },
  {
    id: 8,
    name: 'Aceite Primor x 1L',
    description: 'Aceite vegetal para cocina.',
    barCode: '7801234567904',
    showInEcommerce: true,
    sku: 'ACE-001',
    stock: 20,
    salePrice: 12,
    ecommerceSalePrice: 13,
    ecommercePercentageDiscount: 0,
    measurementUnitId: 3, // L
    measurementQuantity: 1,
    categoryId: 8, // Aceites y Vinagres
    brandId: 7,
  },
];
