import { NextRequest, NextResponse } from 'next/server';
import { saveResults, SkatingResult } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    let data;
    
    // Try to parse JSON, if empty or invalid, treat as empty array
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        data = [];
      } else {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      // If JSON parsing fails, treat as empty array (clear database)
      data = [];
    }
    
    // Tarkista että data on taulukko
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Virheellinen datan muoto. Odotetaan taulukkoa.' },
        { status: 400 }
      );
    }
    
    // Tallenna tietokantaan (tyhjä taulukko tyhjentää tietokannan)
    const count = saveResults(data as SkatingResult[]);
    
    if (count === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tietokanta tyhjennetty',
        count: 0,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Tallennettu ${count} tulosta tietokantaan`,
      count: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Virhe tulosten tallennuksessa:', error);
    return NextResponse.json(
      { 
        error: 'Tulosten tallennus epäonnistui',
        details: error instanceof Error ? error.message : 'Tuntematon virhe'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Lähetä luistelukilpailujen tulokset tähän endpointtiin POST-pyynnöllä',
    example: 'POST /api/results JSON-taulukolla'
  });
}

