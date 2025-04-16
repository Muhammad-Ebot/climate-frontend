// app/api/weather-history/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get query parameters
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const unit = searchParams.get('unit');
  
  if (!lat || !lon || !from || !to) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }
  
  try {
    // Find the closest grid point to the requested lat/lon
    const gridQuery = `
      SELECT grid_id, longitude, latitude, province 
      FROM sindh_grids_daily 
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
    
    // Fetch weather data for the grid point and date range
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
      FROM daily_data_sindh
      WHERE grid_id = $1 AND date BETWEEN $2 AND $3
      ORDER BY date
    `;
    
    const weatherResult = await pool.query(weatherQuery, [gridId, from, to]);
    
    // Process data for unit conversion if needed
    let processedData = weatherResult.rows;
    
    if (unit === 'imperial') {
      // Convert metric to imperial
      processedData = processedData.map(row => ({
        ...row,
        temperature_2m_max: row.temperature_2m_max !== null ? (row.temperature_2m_max * 9/5) + 32 : null,
        temperature_2m_min: row.temperature_2m_min !== null ? (row.temperature_2m_min * 9/5) + 32 : null,
        temperature_2m_mean: row.temperature_2m_mean !== null ? (row.temperature_2m_mean * 9/5) + 32 : null,
        precipitation_sum: row.precipitation_sum !== null ? row.precipitation_sum * 0.0393701 : null, // mm to inches
        wind_speed_10m_max: row.wind_speed_10m_max !== null ? row.wind_speed_10m_max * 0.621371 : null, // km/h to mph
        wind_gusts_10m_max: row.wind_gusts_10m_max !== null ? row.wind_gusts_10m_max * 0.621371 : null, // km/h to mph
      }));
    }
    
    // Add grid information to the response
    const response = {
      grid: gridResult.rows[0],
      weather: processedData
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