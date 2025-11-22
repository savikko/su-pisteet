'use client';

import { SkatingResult } from '@/lib/db';
import { useState } from 'react';

interface ResultsTableProps {
  results: SkatingResult[];
  categories: string[];
}

export default function ResultsTable({ results, categories }: ResultsTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(r => r.AgeCategoryCode === selectedCategory);

  const formatTime = (time: number | null) => {
    if (time === null || time === undefined) return '-';
    return time.toFixed(2);
  };

  const formatDifference = (time: number | null, firstPlaceTime: number | null) => {
    if (time === null || time === undefined || firstPlaceTime === null || firstPlaceTime === undefined) {
      return null;
    }
    const diff = time - firstPlaceTime;
    return diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2);
  };

  // Get the number of valid sequential distances completed (0-4)
  const getValidDistanceCount = (result: SkatingResult) => {
    // Check in competition order: 300m_1, 500m_1, 300m_2, 500m_2
    if (result.M300m_1_aika === null) return 0;
    if (result.M500m_1_aika === null) return 1;
    if (result.M300m_2_aika === null) return 2;
    if (result.M500m_2_aika === null) return 3;
    return 4; // All completed
  };

  // Calculate partial total based on completed sequential distances
  const calculatePartialTotal = (result: SkatingResult) => {
    const count = getValidDistanceCount(result);
    if (count === 0) return null;
    
    let total = 0;
    if (count >= 1) total += result.M300m_1_pisteet || 0;
    if (count >= 2) total += result.M500m_1_pisteet || 0;
    if (count >= 3) total += result.M300m_2_pisteet || 0;
    if (count >= 4) total += result.M500m_2_pisteet || 0;
    
    return total;
  };

  // Sort results by: 1) number of completed distances (desc), 2) partial total (asc)
  const sortedResults = [...filteredResults].sort((a, b) => {
    const aCount = getValidDistanceCount(a);
    const bCount = getValidDistanceCount(b);
    
    // First, sort by number of completed distances (more is better)
    if (aCount !== bCount) {
      return bCount - aCount;
    }
    
    // If same number of distances, sort by partial total
    const aTotal = calculatePartialTotal(a);
    const bTotal = calculatePartialTotal(b);
    
    if (aTotal !== null && bTotal !== null) {
      return aTotal - bTotal;
    }
    
    // If no totals, sort by name
    return `${a.FirstName} ${a.LastName}`.localeCompare(`${b.FirstName} ${b.LastName}`);
  });

  // Get first place time for difference calculation (first skater in the list)
  const firstPlaceTime = sortedResults.length > 0 ? calculatePartialTotal(sortedResults[0]) : null;
  const firstPlaceDistanceCount = sortedResults.length > 0 ? getValidDistanceCount(sortedResults[0]) : 0;
  const showDifferences = selectedCategory !== 'all';

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-blue-600 p-4 border-b border-blue-700 no-print">
          <label className="text-sm font-semibold text-white mr-3">Suodata sarjan mukaan:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white text-gray-800 font-medium"
          >
            <option value="all">Kaikki sarjat ({results.length})</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat} ({results.filter(r => r.AgeCategoryCode === cat).length})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700">
            <tr>
              <th className="sticky left-0 z-20 bg-blue-700 px-2 py-2 text-left text-xs font-bold text-white uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                Nimi
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-white uppercase tracking-wider">
                Sarja
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                300m Pv 1
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                Pisteet
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                500m Pv 1
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                Pisteet
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                300m Pv 2
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                Pisteet
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                500m Pv 2
              </th>
              <th className="px-2 py-2 text-center text-xs font-bold text-blue-200 uppercase tracking-wider">
                Pisteet
              </th>
              <th className="sticky right-0 z-20 bg-blue-800 px-2 py-2 text-center text-xs font-bold text-yellow-300 uppercase tracking-wider shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                Yhteensä
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedResults.map((result, index) => {
              const validCount = getValidDistanceCount(result);
              const partialTotal = calculatePartialTotal(result);
              return (
              <tr 
                key={result.id || index}
                className="group hover:bg-blue-50 transition-colors"
              >
                <td className="sticky left-0 z-10 bg-white group-hover:bg-blue-50 px-2 py-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  <div className="text-sm font-semibold text-gray-900">
                    {result.FirstName} {result.LastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.Club || '-'}
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-center">
                  <span className="px-2 py-0.5 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                    {result.AgeCategoryCode || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                  {formatTime(result.M300m_1_aika)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-blue-700 font-semibold">
                  {formatTime(result.M300m_1_pisteet)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                  {formatTime(result.M500m_1_aika)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-blue-700 font-semibold">
                  {formatTime(result.M500m_1_pisteet)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                  {formatTime(result.M300m_2_aika)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-blue-700 font-semibold">
                  {formatTime(result.M300m_2_pisteet)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-900">
                  {formatTime(result.M500m_2_aika)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-sm text-center text-blue-700 font-semibold">
                  {formatTime(result.M500m_2_pisteet)}
                </td>
                <td className="sticky right-0 z-10 bg-blue-100 px-2 py-2 whitespace-nowrap text-center shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {partialTotal !== null ? (
                    <>
                      <div className="text-sm font-bold text-blue-900">
                        {formatTime(partialTotal)}
                      </div>
                      {showDifferences && index > 0 && firstPlaceTime !== null && partialTotal !== firstPlaceTime && validCount === firstPlaceDistanceCount && (
                        <div className="text-xs text-gray-600 mt-0.5">
                          {formatDifference(partialTotal, firstPlaceTime)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">-</div>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-12 text-gray-600 font-medium no-print">
          Ei tuloksia tälle sarjalle
        </div>
      )}
    </div>
  );
}

