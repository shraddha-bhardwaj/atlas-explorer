export function createSearchParams(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}
export function formatPopulation(population) {
  if (!population) return "N/A";
  return new Intl.NumberFormat().format(population);
}

export function formatCurrencies(currencies) {
  if (!currencies || typeof currencies !== "object") return "N/A";

  const currencyList = Object.values(currencies)
    .map((currency) => `${currency.name} (${currency.symbol || ""})`)
    .filter(Boolean);

  return currencyList.length > 0 ? currencyList.join(", ") : "N/A";
}

export function formatLanguages(languages) {
  if (!languages || typeof languages !== "object") return "N/A";

  const languageList = Object.values(languages).filter(Boolean);
  return languageList.length > 0 ? languageList.join(", ") : "N/A";
}

export function formatCapital(capital) {
  if (!Array.isArray(capital) || capital.length === 0) return "N/A";
  return capital.join(", ");
}

export function formatContinents(continents) {
  if (!Array.isArray(continents) || continents.length === 0) return "N/A";
  return continents.join(", ");
}

export function formatArea(area) {
  if (!area) return "N/A";
  return `${new Intl.NumberFormat().format(area)} km²`;
}

export function formatTimezones(timezones) {
  if (!Array.isArray(timezones) || timezones.length === 0) return "N/A";
  return timezones.slice(0, 3).join(", ") + (timezones.length > 3 ? "..." : "");
}
