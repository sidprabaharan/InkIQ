/*
  Lists tables visible to the anon role by fetching the Supabase REST OpenAPI spec.
  Usage:
    VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/list_tables_openapi.js
*/

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const openApiUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/?`;

  try {
    const response = await fetch(openApiUrl, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        accept: 'application/openapi+json',
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`OpenAPI fetch failed: ${response.status} ${response.statusText} ${text}`);
    }

    const spec = await response.json();

    const paths = spec.paths || {};
    const tableNames = new Set();

    for (const rawPath of Object.keys(paths)) {
      // Paths look like "/table_name" or "/rpc/function_name"
      if (!rawPath.startsWith('/rpc/')) {
        const segment = rawPath.split('?')[0];
        const name = segment.replace(/^\/+/, '').trim();
        if (name && !name.includes('/')) {
          tableNames.add(name);
        }
      }
    }

    const sorted = Array.from(tableNames).sort((a, b) => a.localeCompare(b));

    console.log('Tables accessible to anon:');
    if (sorted.length === 0) {
      console.log('(none)');
    } else {
      for (const name of sorted) {
        console.log(`- ${name}`);
      }
    }
  } catch (error) {
    console.error('Error listing tables:', error.message || error);
    process.exit(1);
  }
}

// Node 18+ has global fetch; if not, dynamic import of node-fetch.
const hasGlobalFetch = typeof fetch === 'function';
if (!hasGlobalFetch) {
  import('node-fetch').then(({ default: fetchImpl }) => {
    global.fetch = fetchImpl;
    return main();
  });
} else {
  main();
}


