/**
 * Utility functions for IUCN and conservation status badges
 */

/**
 * Get the appropriate badge color class for an IUCN category
 */
export function getIUCNBadgeColor(category: string): string {
  switch (category) {
    case "EX": // Extinct
    case "EW": // Extinct in the Wild
      return "bg-black text-white";
    case "CR": // Critically Endangered
      return "bg-red-700 text-white";
    case "EN": // Endangered
      return "bg-orange-600 text-white";
    case "VU": // Vulnerable
      return "bg-yellow-600 text-white";
    case "NT": // Near Threatened
    case "LR/nt": // Lower Risk/near threatened (old IUCN category)
      return "bg-yellow-400 text-black";
    case "LC": // Least Concern
      return "bg-green-600 text-white";
    case "DD": // Data Deficient
      return "bg-gray-500 text-white";
    case "NE": // Not Evaluated
    case "NA": // Not Applicable
      return "bg-gray-300 text-black";
    default:
      return "bg-gray-400 text-white";
  }
}

/**
 * Get the badge color for Vietnamese legal categories
 */
export function getVietnameseLegalBadgeColor(status: string): string {
  if (status === "IB" || status === "IA") {
    return "bg-red-600";
  }
  if (status === "IIA" || status === "IIB") {
    return "bg-yellow-600";
  }
  return "bg-transparent text-black";
}
