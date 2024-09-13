import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  phone:string;
}

// export interface NewProductRequestBody {
//   name: string;
//   category: string;
//   price: number;
//   stock: number;
//   description: string;
// }

export interface NewProductRequestBody {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  size: {
    height: number;
    width: number;
    length: number;
  };
  weight: {
    net: number;
    diamond: number;
    gold: number;
  };
  purity: string;
  basicInfo: {
    productType: string;
    brand: string;
    itemPackageQuantity: number;
    gender: string;
  };
  diamondInfo: {
    color: string;
    clarity: string;
    caratWeight: number;
    pieces: number;
  };
  metalInfo: {
    purity: string;
    metal: string;
    netWeight: number;
  };
  certification: {
    diamondCertification: string;
    hallmarkLicense: string;
  };
  priceBreakup: {
    component: string;
    name: string;
    rate: string;
    weight: string;
    discount: string;
    finalValue: string;
  }[];
  tags: string[];
}
export interface NewCategoryRequestBody {
  name: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}
