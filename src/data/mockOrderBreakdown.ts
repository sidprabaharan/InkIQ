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
        notes: 'Ensure proper ink coverage on navy hoodie',
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
        type: 'Screen Print',
        placement: 'Back Center',
        size: '8" x 6"',
        colours: 'White',
        notes: 'Large back print - use higher mesh count for detail',
        files: [
          {
            id: 'file-1b',
            name: 'back-design-full.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-2',
    title: 'Corporate Event Package - Screen Print',
    products: [
      {
        id: 'product-corp-1',
        category: 'Apparel',
        itemNumber: 'G8800',
        color: 'Forest Green',
        description: 'Ultra Cotton Long Sleeve Polo - Gildan 8800',
        sizes: {
          xs: 2,
          s: 8,
          m: 15,
          l: 20,
          xl: 12,
          xxl: 3,
          xxxl: 0
        },
        quantity: 60,
        price: 32.99,
        tax: true,
        total: 1979.40,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Artwork Approved'
      },
      {
        id: 'product-corp-2',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Royal Blue',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 5,
          s: 10,
          m: 18,
          l: 25,
          xl: 15,
          xxl: 7,
          xxxl: 0
        },
        quantity: 80,
        price: 22.50,
        tax: true,
        total: 1800.00,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Left Chest',
        size: '3" x 2.5"',
        colours: 'White & Gold',
        notes: 'Corporate logo - exact PMS color match required. Gold: PMS 871C',
        files: [
          {
            id: 'file-corp-1',
            name: 'techcorp-logo-final.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-corp-2',
            name: 'color-spec-sheet.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '10" x 4"',
        colours: 'White',
        notes: 'Conference 2024 text - use bold sans-serif font',
        files: [
          {
            id: 'file-corp-3',
            name: 'conference-text.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-3',
    title: 'Sports Team Jersey Order',
    products: [
      {
        id: 'product-sports-1',
        category: 'Sports',
        itemNumber: 'A4NB3142',
        color: 'Navy',
        description: 'Youth Moisture Management Football Jersey',
        sizes: {
          xs: 8,
          s: 12,
          m: 15,
          l: 10,
          xl: 5,
          xxl: 0,
          xxxl: 0
        },
        quantity: 50,
        price: 45.00,
        tax: true,
        total: 2250.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Numbers Ready'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '8" x 6"',
        colours: 'White & Red',
        notes: 'Team logo - high durability inks required for sports use',
        files: [
          {
            id: 'file-sports-1',
            name: 'eagles-logo-vector.eps',
            type: 'EPS Vector',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '12" x 8"',
        colours: 'White',
        notes: 'Player numbers - individual numbering 1-50',
        files: [
          {
            id: 'file-sports-2',
            name: 'number-template.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          },
          {
            id: 'file-sports-3',
            name: 'number-list.xlsx',
            type: 'Excel Spreadsheet',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-4',
    title: 'Restaurant Chain Uniforms',
    products: [
      {
        id: 'product-rest-1',
        category: 'Workwear',
        itemNumber: 'CS401',
        color: 'Black',
        description: 'Short Sleeve Work Shirt - CornerStone CS401',
        sizes: {
          xs: 0,
          s: 5,
          m: 20,
          l: 25,
          xl: 15,
          xxl: 10,
          xxxl: 5
        },
        quantity: 80,
        price: 28.50,
        tax: true,
        total: 2280.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      },
      {
        id: 'product-rest-2',
        category: 'Accessories',
        itemNumber: 'AP101',
        color: 'Black',
        description: 'Three-Pocket Waist Apron',
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
        price: 18.75,
        tax: true,
        total: 468.75,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Left Chest',
        size: '3" x 2"',
        colours: 'Red & Yellow',
        notes: 'Restaurant logo - food safe inks only. Must withstand commercial washing',
        files: [
          {
            id: 'file-rest-1',
            name: 'bistro-logo-final.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-rest-2',
            name: 'food-safe-ink-spec.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-5',
    title: 'Music Festival Merchandise',
    products: [
      {
        id: 'product-fest-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Heather Grey',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 10,
          s: 25,
          m: 40,
          l: 35,
          xl: 20,
          xxl: 10,
          xxxl: 0
        },
        quantity: 140,
        price: 24.99,
        tax: true,
        total: 3498.60,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'In Production'
      },
      {
        id: 'product-fest-2',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Black',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 5,
          s: 15,
          m: 25,
          l: 30,
          xl: 15,
          xxl: 10,
          xxxl: 0
        },
        quantity: 100,
        price: 42.50,
        tax: true,
        total: 4250.00,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Artwork Approved'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '12" x 8"',
        colours: 'Neon Pink, Electric Blue, Yellow',
        notes: 'Festival artwork - vibrant colors, glow-in-dark ink on hoodie version',
        files: [
          {
            id: 'file-fest-1',
            name: 'festival-artwork-2024.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-fest-2',
            name: 'glow-ink-mockup.png',
            type: 'PNG Image',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '6" x 4"',
        colours: 'White',
        notes: 'Artist lineup - use condensed font for readability',
        files: [
          {
            id: 'file-fest-3',
            name: 'artist-lineup-text.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-6',
    title: 'Non-Profit Fundraiser Shirts',
    products: [
      {
        id: 'product-np-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Cardinal',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 3,
          s: 12,
          m: 18,
          l: 22,
          xl: 15,
          xxl: 8,
          xxxl: 2
        },
        quantity: 80,
        price: 26.00,
        tax: false,
        total: 2080.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '10" x 6"',
        colours: 'White & Gold',
        notes: 'Charity logo and event name - donate portion of proceeds',
        files: [
          {
            id: 'file-np-1',
            name: 'charity-logo-vector.eps',
            type: 'EPS Vector',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-np-2',
            name: 'fundraiser-text.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-7',
    title: 'School Spirit Wear',
    products: [
      {
        id: 'product-school-1',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Navy',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 15,
          s: 20,
          m: 25,
          l: 20,
          xl: 15,
          xxl: 5,
          xxxl: 0
        },
        quantity: 100,
        price: 38.50,
        tax: true,
        total: 3850.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Screens Burned'
      },
      {
        id: 'product-school-2',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Gold',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 8,
          s: 15,
          m: 20,
          l: 25,
          xl: 12,
          xxl: 5,
          xxxl: 0
        },
        quantity: 85,
        price: 22.75,
        tax: true,
        total: 1933.75,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '8" x 6"',
        colours: 'Navy Blue & Gold',
        notes: 'School mascot logo - high detail required, use premium inks for durability',
        files: [
          {
            id: 'file-school-1',
            name: 'wildcat-mascot-vector.eps',
            type: 'EPS Vector',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-school-2',
            name: 'school-colors-spec.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '6" x 2"',
        colours: 'Navy Blue',
        notes: 'School name text - bold lettering for visibility',
        files: [
          {
            id: 'file-school-3',
            name: 'school-name-text.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-8',
    title: 'Trade Show Promotional Items',
    products: [
      {
        id: 'product-trade-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'White',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 20,
          s: 40,
          m: 60,
          l: 50,
          xl: 25,
          xxl: 5,
          xxxl: 0
        },
        quantity: 200,
        price: 18.50,
        tax: true,
        total: 3700.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      },
      {
        id: 'product-trade-2',
        category: 'Accessories',
        itemNumber: 'BAG001',
        color: 'Black',
        description: 'Cotton Canvas Tote Bag',
        sizes: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          xxl: 0,
          xxxl: 100
        },
        quantity: 100,
        price: 12.75,
        tax: true,
        total: 1275.00,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Ink Mixed'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '10" x 8"',
        colours: 'Black, Red, Blue',
        notes: 'Trade show logo with event date - use vibrant colors for booth visibility',
        files: [
          {
            id: 'file-trade-1',
            name: 'tradeshow-logo-2024.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-trade-2',
            name: 'booth-setup-photo.jpg',
            type: 'JPEG Image',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Upper',
        size: '12" x 4"',
        colours: 'Black',
        notes: 'Event hashtag and website - use readable font size',
        files: [
          {
            id: 'file-trade-3',
            name: 'hashtag-design.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-9',
    title: 'Brewery Merchandise Collection - Screen Print',
    products: [
      {
        id: 'product-brew-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Heather Forest',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 8,
          s: 25,
          m: 35,
          l: 40,
          xl: 20,
          xxl: 12,
          xxxl: 0
        },
        quantity: 140,
        price: 26.50,
        tax: true,
        total: 3710.00,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Inks Mixed'
      },
      {
        id: 'product-brew-2',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Charcoal',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 5,
          s: 15,
          m: 25,
          l: 30,
          xl: 15,
          xxl: 10,
          xxxl: 0
        },
        quantity: 100,
        price: 42.00,
        tax: true,
        total: 4200.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '6" x 4"',
        colours: 'White & Copper',
        notes: 'Brewery logo with metallic copper accent - use specialty ink for premium finish',
        files: [
          {
            id: 'file-brew-1',
            name: 'brewery-logo-metallic.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-brew-2',
            name: 'copper-ink-spec.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '8" x 3"',
        colours: 'White',
        notes: 'Brewery tagline and established date - vintage style lettering',
        files: [
          {
            id: 'file-brew-3',
            name: 'brewery-tagline.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-10',
    title: 'Fitness Center Staff Uniforms - Screen Print',
    products: [
      {
        id: 'product-fitness-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Black',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 5,
          s: 15,
          m: 20,
          l: 25,
          xl: 15,
          xxl: 5,
          xxxl: 0
        },
        quantity: 85,
        price: 24.99,
        tax: true,
        total: 2124.15,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Screens Burned'
      },
      {
        id: 'product-fitness-2',
        category: 'Apparel',
        itemNumber: 'TANK001',
        color: 'Grey',
        description: 'Performance Tank Top',
        sizes: {
          xs: 8,
          s: 12,
          m: 18,
          l: 20,
          xl: 12,
          xxl: 5,
          xxxl: 0
        },
        quantity: 75,
        price: 19.50,
        tax: true,
        total: 1462.50,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '5" x 3"',
        colours: 'Neon Green & White',
        notes: 'Fitness center logo with energetic colors - use athletic-grade inks for moisture resistance',
        files: [
          {
            id: 'file-fitness-1',
            name: 'fitness-logo-athletic.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-fitness-2',
            name: 'athletic-ink-spec.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-11',
    title: 'Real Estate Team Polo Shirts - Screen Print',
    products: [
      {
        id: 'product-realestate-1',
        category: 'Apparel',
        itemNumber: 'G8800',
        color: 'Navy',
        description: 'Ultra Cotton Long Sleeve Polo - Gildan 8800',
        sizes: {
          xs: 2,
          s: 8,
          m: 15,
          l: 18,
          xl: 10,
          xxl: 4,
          xxxl: 1
        },
        quantity: 58,
        price: 34.50,
        tax: true,
        total: 2001.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Left Chest',
        size: '3.5" x 2.5"',
        colours: 'White & Gold',
        notes: 'Professional real estate team logo - premium appearance required for client meetings',
        files: [
          {
            id: 'file-realestate-1',
            name: 'realestate-logo-professional.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-realestate-2',
            name: 'team-roster.xlsx',
            type: 'Excel Spreadsheet',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Back Center',
        size: '4" x 2"',
        colours: 'White',
        notes: 'Team contact information and tagline',
        files: [
          {
            id: 'file-realestate-3',
            name: 'contact-info-design.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-12',
    title: 'Tech Startup Employee Swag - Screen Print',
    products: [
      {
        id: 'product-tech-1',
        category: 'Apparel',
        itemNumber: 'BC3001',
        color: 'Heather Grey',
        description: 'Unisex Jersey Short Sleeve Tee - Bella + Canvas 3001',
        sizes: {
          xs: 15,
          s: 30,
          m: 45,
          l: 50,
          xl: 25,
          xxl: 10,
          xxxl: 0
        },
        quantity: 175,
        price: 22.00,
        tax: true,
        total: 3850.00,
        mockupImages: ['/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'],
        status: 'Ready to Print'
      },
      {
        id: 'product-tech-2',
        category: 'Apparel',
        itemNumber: 'G18500',
        color: 'Black',
        description: 'Unisex Heavy Cotton Hoodie - Gildan 18500',
        sizes: {
          xs: 8,
          s: 20,
          m: 30,
          l: 35,
          xl: 20,
          xxl: 12,
          xxxl: 0
        },
        quantity: 125,
        price: 45.00,
        tax: true,
        total: 5625.00,
        mockupImages: ['/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'],
        status: 'Artwork Approved'
      }
    ],
    imprintSections: [
      {
        type: 'Screen Print',
        placement: 'Front Center',
        size: '7" x 5"',
        colours: 'Electric Blue, White, Orange',
        notes: 'Modern tech company logo with gradient effect - use specialty inks for color blend',
        files: [
          {
            id: 'file-tech-1',
            name: 'tech-logo-gradient.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          },
          {
            id: 'file-tech-2',
            name: 'gradient-print-guide.pdf',
            type: 'PDF Document',
            url: '/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png'
          }
        ]
      },
      {
        type: 'Screen Print',
        placement: 'Left Sleeve',
        size: '2" x 1"',
        colours: 'Electric Blue',
        notes: 'Small company initials on sleeve',
        files: [
          {
            id: 'file-tech-3',
            name: 'company-initials.ai',
            type: 'Adobe Illustrator',
            url: '/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png'
          }
        ]
      }
    ]
  },
  {
    id: 'group-99',
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
    id: 'group-10',
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
      }
    ]
  }
];