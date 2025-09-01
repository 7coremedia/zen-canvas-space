import { getBrandData } from "../store/brandDataStore"

/**
 * Summary Panel Component
 * 
 * Displays the current BrandData state in a read-only format.
 * For now, renders as JSON - will be enhanced with proper UI later.
 */
export function SummaryPanel() {
  const brandData = getBrandData()
  
  return (
    <div className="summary-panel">
      <h3>Brand Data Summary</h3>
      <pre className="brand-data-json">
        {JSON.stringify(brandData, null, 2)}
      </pre>
    </div>
  )
}
