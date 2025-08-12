import { ImprintFile } from './imprint';

export interface SavedImprint {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  decorationMethod: string;
  location: string;
  description?: string;
  tags: string[];
  files: {
    customerArt: ImprintFile[];
    productionFiles: ImprintFile[];
    proofMockup: ImprintFile[];
  };
  dimensions: {
    width: number;
    height: number;
  };
  colors: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface SavedImprintGroup {
  decorationMethod: string;
  imprints: SavedImprint[];
}