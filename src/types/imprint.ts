export interface ImprintFile {
  id: string;
  name: string;
  url: string;
  type: string;
  category: 'customerArt' | 'productionFiles' | 'proofMockup';
}

export interface ImprintItem {
  id: string;
  method: string;
  location: string;
  width: number;
  height: number;
  colorsOrThreads: string;
  notes: string;
  customerArt: ImprintFile[];
  productionFiles: ImprintFile[];
  proofMockup: ImprintFile[];
}

export interface ImprintMethod {
  value: string;
  label: string;
  customerArtTypes: string[];
  productionFileTypes: string[];
  instructions: string;
  requirements?: string[];
}

export const IMPRINT_METHODS: ImprintMethod[] = [
  {
    value: "screenPrinting",
    label: "Screen Printing",
    customerArtTypes: ["jpg", "png", "pdf", "ai", "eps"],
    productionFileTypes: ["ai", "eps", "pdf", "psd", "zip"],
    instructions: "Vector spot colors or PSD with spot-color channels. Include underbase if needed.",
    requirements: ["Vector files preferred", "Spot color separations", "Include underbase for dark garments"]
  },
  {
    value: "embroidery",
    label: "Embroidery", 
    customerArtTypes: ["jpg", "png", "pdf", "ai", "eps"],
    productionFileTypes: ["emb", "pxf", "ofm", "dst", "exp", "pes", "jef", "vp3"],
    instructions: "Native embroidery files (emb, pxf, ofm) or stitch files (dst, exp). Include thread chart if available.",
    requirements: ["Stitch files required", "Thread chart recommended", "Consider stitch density"]
  },
  {
    value: "dtg",
    label: "DTG",
    customerArtTypes: ["png", "tiff", "psd"],
    productionFileTypes: ["png", "tiff", "psd"],
    instructions: "PNG or TIFF with transparency at print size. RGB, sRGB color space.",
    requirements: ["Transparency required", "Print size resolution", "RGB color space"]
  },
  {
    value: "dtf",
    label: "DTF",
    customerArtTypes: ["png", "tiff", "pdf"],
    productionFileTypes: ["png", "tiff", "pdf"],
    instructions: "PNG or TIFF with transparency at size. Optional gang sheet PDF.",
    requirements: ["Transparency required", "Final print size", "Gang sheet layout optional"]
  },
  {
    value: "sublimation",
    label: "Sublimation",
    customerArtTypes: ["png", "tiff", "jpg"],
    productionFileTypes: ["pdf", "png", "tiff"],
    instructions: "RGB files at print size with bleed. Mirror if required for substrate.",
    requirements: ["RGB color space", "Bleed area included", "Mirror for some substrates"]
  },
  {
    value: "heatTransferVinyl",
    label: "Heat Transfer Vinyl (CAD Cut)",
    customerArtTypes: ["ai", "eps", "pdf", "svg", "dxf"],
    productionFileTypes: ["ai", "eps", "pdf", "svg", "dxf"],
    instructions: "Clean vector cut paths. Mirror if required for application.",
    requirements: ["Vector artwork only", "Clean cut paths", "Mirror for dark vinyl"]
  },
  {
    value: "printCutHtv",
    label: "Print and Cut HTV",
    customerArtTypes: ["ai", "eps", "pdf"],
    productionFileTypes: ["pdf", "eps"],
    instructions: "PDF or EPS with spot cut path (CutContour) and registration marks.",
    requirements: ["Cut path included", "Registration marks", "Print + cut file format"]
  },
  {
    value: "screenPrintedTransfers",
    label: "Screen-Printed Transfers",
    customerArtTypes: ["jpg", "png", "pdf", "ai", "eps"],
    productionFileTypes: ["ai", "eps", "pdf", "zip"],
    instructions: "Same as screen printing. Separations or 1-bit TIFF files. Gang sheet PDF acceptable.",
    requirements: ["Color separations", "Gang sheet layout", "Transfer specifications"]
  },
  {
    value: "laserEngraving",
    label: "Laser Engraving",
    customerArtTypes: ["ai", "eps", "pdf", "svg", "png", "bmp"],
    productionFileTypes: ["ai", "eps", "pdf", "svg", "png", "bmp"],
    instructions: "Vector for line work, 1-bit or grayscale raster for fills.",
    requirements: ["Vector for lines", "Grayscale for fills", "High contrast artwork"]
  },
  {
    value: "uvDigitalPrint",
    label: "UV Digital Print",
    customerArtTypes: ["ai", "eps", "pdf", "png", "tiff"],
    productionFileTypes: ["pdf", "png", "tiff"],
    instructions: "PDF/X with spot layers for White and Varnish. PNG/TIFF at size if no layers.",
    requirements: ["White ink layer", "Varnish layer optional", "Spot color support"]
  },
  {
    value: "padPrinting",
    label: "Pad Printing",
    customerArtTypes: ["ai", "eps", "pdf"],
    productionFileTypes: ["ai", "eps", "pdf", "zip"],
    instructions: "Vector artwork per color or zip of 1-bit TIFF films.",
    requirements: ["Vector artwork", "Color separations", "Film ready files"]
  },
  {
    value: "foilDebossEmboss",
    label: "Foil/Deboss/Emboss",
    customerArtTypes: ["ai", "eps", "pdf"],
    productionFileTypes: ["ai", "eps", "pdf"],
    instructions: "Mirrored single-color vector die art.",
    requirements: ["Vector outline only", "Mirrored artwork", "Die specifications"]
  }
];

export function getMethodConfig(methodValue: string): ImprintMethod | undefined {
  return IMPRINT_METHODS.find(method => method.value === methodValue);
}