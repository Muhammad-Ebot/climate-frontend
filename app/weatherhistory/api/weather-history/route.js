// app/weatherhistory/api/weather-history/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const PROVINCE_TABLES = {
  'sindh': 'sindh_grids_daily',
  'punjab': 'punjab_grids_daily',
  'balochistan': 'balochistan_grids_daily',
  'kpk': 'kpk_grids_daily',
  'azad kashmir': 'azad_kashmir_grids_daily',
  'gilgit baltistan': 'gilgit_baltistan_grids_daily',
  'federal capital territory': 'federal_capital_territory_grids_daily',
  'fata': 'fata_grids_daily'
};

const DAILY_DATA_TABLES = {
  'sindh': 'daily_data_sindh',
  'punjab': 'daily_data_punjab',
  'balochistan': 'daily_data_balochistan',
  'kpk': 'daily_data_kpk',
  'azad kashmir': 'daily_data_azad_kashmir',
  'gilgit baltistan': 'daily_data_gilgit_baltistan',
  'federal capital territory': 'daily_data_federal_capital_territory',
  'fata': 'daily_data_fata'
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const unit = searchParams.get('unit');
  const province = searchParams.get('province')?.toLowerCase();

  if (!lat || !lon || !from || !to) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Determine which grid table to use based on province or closest match
    let gridTable, dailyTable;
    
    if (province && PROVINCE_TABLES[province]) {
      gridTable = PROVINCE_TABLES[province];
      dailyTable = DAILY_DATA_TABLES[province];
    } else {
      // If no province or invalid province, search all grid tables
      gridTable = Object.values(PROVINCE_TABLES).join(' UNION ALL SELECT grid_id, longitude, latitude, province FROM ');
      dailyTable = null; // Will be determined after finding the grid
    }

    const gridQuery = `
      SELECT grid_id, longitude, latitude, province 
      FROM (SELECT grid_id, longitude, latitude, province FROM ${gridTable}) as all_grids
      ORDER BY point(longitude, latitude) <-> point($1, $2)
      LIMIT 1
    `;

    const gridResult = await pool.query(gridQuery, [lon, lat]);

    if (gridResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'No grid point found near the specified coordinates' },
        { status: 404 }
      );
    }

    const gridId = gridResult.rows[0].grid_id;
    const foundProvince = gridResult.rows[0].province.toLowerCase();

    // Use the province-specific daily data table if not already determined
    if (!dailyTable) {
      dailyTable = DAILY_DATA_TABLES[foundProvince] || 'daily_data_sindh'; // fallback
    }

    const weatherQuery = `
      SELECT 
        date,
        temperature_2m_max,
        temperature_2m_min,
        temperature_2m_mean,
        precipitation_sum,
        wind_speed_10m_max,
        wind_gusts_10m_max,
        wind_direction_10m_dominant,
        shortwave_radiation_sum,
        et0_fao_evapotranspiration
      FROM ${dailyTable}
      WHERE 
        grid_id = $1
        AND date >= ($2::date || ' 00:00:00+05')::timestamptz
        AND date <= ($3::date || ' 00:00:00+05')::timestamptz
      ORDER BY date
    `;

    const weatherResult = await pool.query(weatherQuery, [gridId, from, to]);

    // Process data for unit conversion if needed
    let processedData = weatherResult.rows;

    if (unit === 'imperial') {
      processedData = processedData.map(row => ({
        ...row,
        temperature_2m_max: row.temperature_2m_max !== null ? (row.temperature_2m_max * 9/5) + 32 : null,
        temperature_2m_min: row.temperature_2m_min !== null ? (row.temperature_2m_min * 9/5) + 32 : null,
        temperature_2m_mean: row.temperature_2m_mean !== null ? (row.temperature_2m_mean * 9/5) + 32 : null,
        precipitation_sum: row.precipitation_sum !== null ? row.precipitation_sum * 0.0393701 : null,
        wind_speed_10m_max: row.wind_speed_10m_max !== null ? row.wind_speed_10m_max * 0.621371 : null,
        wind_gusts_10m_max: row.wind_gusts_10m_max !== null ? row.wind_gusts_10m_max * 0.621371 : null,
      }));
    }

    const response = {
      grid: gridResult.rows[0],
      weather: processedData,
      province: foundProvince
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data: ' + error.message },
      { status: 500 }
    );
  }
}