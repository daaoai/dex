import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build the CoinMarketCap API URL
    const params = new URLSearchParams({
      start: searchParams.get('start') || '1',
      limit: searchParams.get('limit') || '100',
      sortBy: searchParams.get('sortBy') || 'trending_24h',
      sortType: searchParams.get('sortType') || 'desc',
      convert: searchParams.get('convert') || 'USD',
      cryptoType: searchParams.get('cryptoType') || 'all',
      tagType: searchParams.get('tagType') || 'all',
      audited: searchParams.get('audited') || 'false',
      tagSlugs: searchParams.get('tagSlugs') || 'bnb-chain-ecosystem',
      platformId: searchParams.get('platformId') || '',
      aux:
        searchParams.get('aux') ||
        'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap',
    });

    const url = `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (!response.ok) {
      console.error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: 'Failed to fetch data from CoinMarketCap' }, { status: response.status });
    }

    const data = await response.json();

    // Add CORS headers to allow frontend access
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300', // Cache for 1 minute
      },
    });
  } catch (error) {
    console.error('CoinMarketCap API proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
