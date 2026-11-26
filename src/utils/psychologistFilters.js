const PRICE_LIMIT = 100;

const FILTERS = {
  a_to_z: { sort: (a, b) => a.name.localeCompare(b.name) },
  z_to_a: { sort: (a, b) => b.name.localeCompare(a.name) },
  less_than_100: { filter: (p) => p.price_per_hour < PRICE_LIMIT },
  greater_than_100: { filter: (p) => p.price_per_hour >= PRICE_LIMIT },
  popular: { sort: (a, b) => b.rating - a.rating },
  not_popular: { sort: (a, b) => a.rating - b.rating },
  show_all: {},
};

export const DEFAULT_FILTER = 'show_all';

export function applyFilter(list, filterKey) {
  const { filter, sort } = FILTERS[filterKey] ?? FILTERS[DEFAULT_FILTER];

  let result = filter ? list.filter(filter) : [...list];
  if (sort) result.sort(sort);

  return result;
}

export function paginate(list, page, perPage) {
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const start = (page - 1) * perPage;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    items: list.slice(start, start + perPage),
  };
}
