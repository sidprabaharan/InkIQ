import { LineItemGroupData } from '@/components/quotes/OrderBreakdown';

export const mockOrderBreakdownData: LineItemGroupData[] = [
  {
    id: 'group-1',
    title: 'Heimat Logo - Screen Print',
    products: [
      {
        id: 'product-1',
        name: 'Unisex Heavy Cotton Hoodie',
        description: 'Gildan 18500 - Navy',
        sizes: {
          'S': 2,
          'M': 5,
          'L': 8,
          'XL': 3,
          '2XL': 1
        },
        unitPrice: 45.50,
        totalQuantity: 19,
        totalPrice: 864.50,
        mockupImage: '/placeholder.svg', // Will use placeholder until real images are available
        status: 'Pending'
      },
      {
        id: 'product-2',
        name: 'Unisex Jersey Short Sleeve Tee',
        description: 'Bella + Canvas 3001 - Black',
        sizes: {
          'S': 3,
          'M': 7,
          'L': 10,
          'XL': 5,
          '2XL': 2
        },
        unitPrice: 28.75,
        totalQuantity: 27,
        totalPrice: 776.25,
        mockupImage: '/placeholder.svg',
        status: 'In Production'
      }
    ],
    imprintDetails: {
      printMethod: 'Screen Print',
      logoPlacement: 'Front Center',
      logoSize: '4" x 3"',
      logoColors: ['Black', 'White'],
      files: [
        {
          id: 'file-1',
          name: 'heimat-logo-vector.ai',
          type: 'Adobe Illustrator',
          url: '/placeholder.svg'
        },
        {
          id: 'file-2',
          name: 'heimat-logo-high-res.png',
          type: 'PNG Image',
          url: '/placeholder.svg'
        }
      ]
    }
  },
  {
    id: 'group-2',
    title: 'Heimat Logo - Embroidery',
    products: [
      {
        id: 'product-3',
        name: 'Unisex Heavy Cotton Hoodie',
        description: 'Gildan 18500 - Heather Grey',
        sizes: {
          'M': 3,
          'L': 5,
          'XL': 2
        },
        unitPrice: 52.00,
        totalQuantity: 10,
        totalPrice: 520.00,
        mockupImage: '/placeholder.svg',
        status: 'Complete'
      }
    ],
    imprintDetails: {
      printMethod: 'Embroidery',
      logoPlacement: 'Left Chest',
      logoSize: '3" x 2.5"',
      logoColors: ['Navy', 'Gold'],
      files: [
        {
          id: 'file-3',
          name: 'heimat-logo-embroidery.dst',
          type: 'Embroidery File',
          url: '/placeholder.svg'
        }
      ]
    }
  },
  {
    id: 'group-3',
    title: 'Heimat Logo - Small Print',
    products: [
      {
        id: 'product-4',
        name: 'Ceramic Coffee Mug',
        description: '11oz White Ceramic Mug',
        sizes: {
          'Standard': 25
        },
        unitPrice: 12.50,
        totalQuantity: 25,
        totalPrice: 312.50,
        mockupImage: '/placeholder.svg',
        status: 'Artwork Pending'
      }
    ],
    imprintDetails: {
      printMethod: 'Digital Print',
      logoPlacement: 'Front Center',
      logoSize: '2" x 1.5"',
      logoColors: ['Full Color'],
      files: [
        {
          id: 'file-4',
          name: 'heimat-logo-full-color.pdf',
          type: 'PDF Document',
          url: '/placeholder.svg'
        }
      ]
    }
  }
];