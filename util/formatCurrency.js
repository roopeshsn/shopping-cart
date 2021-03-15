const options = {
  style: 'currency',
  currency: 'USD',
};

const formatter = new Intl.NumberFormat(undefined, options);

export default function formatCurrency(amount) {
  return formatter.format(amount);
}
