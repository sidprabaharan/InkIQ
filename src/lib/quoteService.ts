import supabase from './supabaseClient';
import type { QuotationData, CompanyInfo, QuoteItem, InvoiceSummary } from '@/components/quotes/QuoteData';

function isUuidLike(value: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);
}

function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  const num = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(num)) return '$0.00';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export async function getQuoteByIdFromDb(idOrNumber: string): Promise<QuotationData | null> {
  // 1) Load the quote (by quote_number first, then by UUID if applicable)
  let quoteRow: any | null = null;

  {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_number', idOrNumber)
      .maybeSingle();
    if (!error && data) quoteRow = data;
  }

  if (!quoteRow && isUuidLike(idOrNumber)) {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', idOrNumber)
      .maybeSingle();
    if (!error && data) quoteRow = data;
  }

  if (!quoteRow) return null;

  // 2) Load items
  const { data: itemRows } = await supabase
    .from('quote_items')
    .select('*')
    .eq('quote_id', quoteRow.id)
    .order('created_at', { ascending: true });

  // 3) Load customer
  let customerRow: any | null = null;
  if (quoteRow.customer_id) {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('id', quoteRow.customer_id)
      .maybeSingle();
    customerRow = data ?? null;
  }

  // 4) Map to QuotationData view model expected by the UI
  const company: CompanyInfo = {
    name: 'InkIQ',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    phone: '',
    website: '',
    email: ''
  };

  const billing = customerRow
    ? {
        name: `${customerRow.first_name ?? ''} ${customerRow.last_name ?? ''}`.trim(),
        company: customerRow.company_name ?? customerRow.name ?? '',
        contact: `${customerRow.first_name ?? ''} ${customerRow.last_name ?? ''}`.trim(),
        address: customerRow.billing_address_1 ?? customerRow.address ?? '',
        city: customerRow.billing_city ?? customerRow.city ?? '',
        region: customerRow.billing_state_province ?? customerRow.state ?? '',
        postalCode: customerRow.billing_zip_code ?? customerRow.zip ?? '',
        phone: customerRow.phone_number ?? customerRow.phone ?? '',
        email: customerRow.email ?? ''
      }
    : {
        name: '',
        company: '',
        contact: '',
        address: '',
        city: '',
        region: '',
        postalCode: '',
        phone: '',
        email: ''
      };

  const shipping = customerRow
    ? {
        company: customerRow.company_name ?? customerRow.name ?? '',
        contact: `${customerRow.first_name ?? ''} ${customerRow.last_name ?? ''}`.trim(),
        address: customerRow.shipping_address_1 ?? customerRow.address ?? '',
        unit: customerRow.shipping_address_2 ?? '',
        city: customerRow.shipping_city ?? customerRow.city ?? '',
        region: customerRow.shipping_state_province ?? customerRow.state ?? '',
      }
    : {
        company: '',
        contact: '',
        address: '',
        unit: '',
        city: '',
        region: ''
      };

  const quoteItems: QuoteItem[] = (itemRows ?? []).map((r: any) => ({
    category: r.category ?? '',
    itemNumber: r.item_number ?? '',
    color: r.color ?? '',
    description: r.description ?? '',
    xs: String(r.size_xs ?? 0),
    s: String(r.size_s ?? 0),
    m: String(r.size_m ?? 0),
    l: String(r.size_l ?? 0),
    xl: String(r.size_xl ?? 0),
    xxl: String(r.size_2xl ?? 0),
    qty: String(r.total_quantity ?? 0),
    quantity: String(r.total_quantity ?? 0),
    price: formatCurrency(r.unit_price ?? 0),
    taxed: Boolean(r.is_taxed),
    total: formatCurrency(r.line_total ?? 0),
    status: 'Quoted'
  }));

  const summary: InvoiceSummary = {
    itemTotal: formatCurrency(quoteRow.subtotal ?? 0),
    feesTotal: formatCurrency(quoteRow.fees_total ?? 0),
    subTotal: formatCurrency((quoteRow.subtotal ?? 0) + (quoteRow.fees_total ?? 0)),
    discount: formatCurrency(0),
    salesTax: formatCurrency(quoteRow.tax_amount ?? 0),
    totalDue: formatCurrency(quoteRow.total_amount ?? 0)
  };

  const result: QuotationData = {
    id: quoteRow.quote_number ?? quoteRow.id,
    nickname: quoteRow.title ?? '',
    company,
    customer: { billing, shipping },
    details: {
      owner: quoteRow.owner_id ?? '',
      deliveryMethod: 'Delivery',
      poNumber: undefined,
      created: quoteRow.created_at ?? undefined,
      productionDueDate: quoteRow.production_due_date ?? '',
      paymentDueDate: quoteRow.payment_due_date ?? '',
      customerDueDate: quoteRow.customer_due_date ?? undefined,
      invoiceDate: quoteRow.invoice_date ?? ''
    },
    notes: {
      customer: quoteRow.notes ?? '',
      production: quoteRow.internal_notes ?? ''
    },
    items: quoteItems,
    summary,
    status: quoteRow.quote_status ?? 'draft',
    imprints: []
  };

  return result;
}


