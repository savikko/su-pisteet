import { getAllResults, getCategories, SkatingResult } from "@/lib/db";
import ResultsTable from "./components/ResultsTable";

export const dynamic = "force-dynamic";

export default async function Home() {
  let results: SkatingResult[] = [];
  let categories: string[] = [];
  let error: string | null = null;

  try {
    results = getAllResults();
    categories = getCategories();
  } catch (err) {
    error = err instanceof Error ? err.message : "Tulosten lataus epäonnistui";
    console.error("Virhe tulosten latauksessa:", err);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 no-print">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src="https://su-luistelu.fi/wp-content/uploads/SU_pieni.jpg"
              alt="SU Logo"
              className="h-24 md:h-32 w-auto"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Kilpailutulokset
          </h1>
          <div className="mt-4 inline-block bg-white/95 px-6 py-2 rounded-full shadow-lg">
            <span className="text-sm text-gray-600">Tuloksia: </span>
            <span className="font-bold text-blue-800">{results.length}</span>
            {categories.length > 0 && (
              <>
                <span className="text-sm text-gray-600 ml-4">Sarjoja: </span>
                <span className="font-bold text-blue-800">
                  {categories.length}
                </span>
              </>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg shadow-md no-print">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {results.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow-2xl p-12 text-center no-print">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              Ei tuloksia vielä
            </h2>
          </div>
        ) : (
          <ResultsTable results={results} categories={categories} />
        )}

        <footer className="mt-12 text-center text-blue-200 text-sm no-print">
          <p>
            Päivitetty:{" "}
            {new Date().toLocaleString("fi-FI", {
              timeZone: "Europe/Helsinki",
            })}
          </p>
          <p className="mt-2 text-blue-300">Seinäjoen Urheilijat</p>
        </footer>
      </div>
    </main>
  );
}
