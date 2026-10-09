export function calculate(v) {
  const n = key => Math.max(0, Number(v[key]) || 0);
  const material = v.type === 'print' ? n('grams') / 1000 * n('materialRate') : n('sheets') * n('materialRate');
  const machine = (v.type === 'print' ? n('hours') : n('minutes') / 60) * n('machineRate');
  const labor = n('laborMinutes') / 60 * n('laborRate');
  const cost = material * (1 + n('waste') / 100) + machine + labor + n('extra');
  const price = cost * (1 + n('markup') / 100);
  return {material, machine, labor, cost, price, total:price * Math.max(1, Math.floor(n('quantity')))};
}
export function totals(items, tax=0, discount=0) {
  const subtotal = items.reduce((s,i)=>s+i.total,0);
  const reduction = Math.min(subtotal, Math.max(0, Number(discount)||0));
  const taxable = subtotal-reduction;
  return {subtotal,discount:reduction,tax:taxable*Math.max(0,Number(tax)||0)/100,total:taxable*(1+Math.max(0,Number(tax)||0)/100)};
}
