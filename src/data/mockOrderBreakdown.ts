import { LineItemGroupData } from '@/components/quotes/OrderBreakdown';

export const mockOrderBreakdownData: LineItemGroupData[] = [
  {
    id: 'group-1',
    title: 'Screen Print',
    products: [
      {
        id: 'product-1',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Navy',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 0,
          s: 2,
          m: 5,
          l: 8,
          xl: 3,
          xxl: 1,
          xxxl: 0
        },
        quantity: 19,
        price: 45.50,
        tax: true,
        total: 864.50,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Pending'
      },
      {
        id: 'product-2',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Black',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 0,
          s: 3,
          m: 7,
          l: 10,
          xl: 5,
          xxl: 2,
          xxxl: 0
        },
        quantity: 27,
        price: 28.75,
        tax: true,
        total: 776.25,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'In Production'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '4" x 3"',
        colours: 'Black & White',
        files: [
          {
            id: 'file-1',
            name: 'heimat-logo-vector.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-2',
            name: 'heimat-logo-high-res.png',
            type: 'PNG Image',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      },
      {
        type: 'Embroidery',
        placement: 'Left Chest',
        size: '2" x 1.5"',
        colours: 'Navy thread',
        notes: 'Ensure thread matches hoodie color',
        files: [
          {
            id: 'file-1b',
            name: 'heimat-logo-embroidery.dst',
            type: 'Embroidery File',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-2',
    title: 'Embroidery',
    products: [
      {
        id: 'product-3',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Heather Grey',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 0,
          s: 0,
          m: 3,
          l: 5,
          xl: 2,
          xxl: 0,
          xxxl: 0
        },
        quantity: 10,
        price: 52.00,
        tax: true,
        total: 520.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Complete'
      }
    ],
    imprintSections: [
      {
        type: 'Embroidery',
        placement: 'Left Chest',
        size: '3" x 2.5"',
        colours: 'Navy & Gold',
        files: [
          {
            id: 'file-3',
            name: 'heimat-logo-embroidery.dst',
            type: 'Embroidery File',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-3',
    title: 'Digital Print',
    products: [
      {
        id: 'product-4',
        category: 'Drinkware',
        itemNumber: 'MUG11',
        color: 'White',
        description: '11oz White Ceramic Mug',
        sizes: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          xxl: 0,
          xxxl: 25
        },
        quantity: 25,
        price: 12.50,
        tax: true,
        total: 312.50,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Artwork Pending'
      }
    ],
    imprintSections: [
      {
        type: 'Digital Print',
        placement: 'Front Center',
        size: '2" x 1.5"',
        colours: 'Full Color',
        files: [
          {
            id: 'file-4',
            name: 'heimat-logo-full-color.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '8" x 6"',
        colours: 'White ink',
        notes: 'Large back print requires special setup',
        files: [
          {
            id: 'file-4b',
            name: 'back-design.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  }
];