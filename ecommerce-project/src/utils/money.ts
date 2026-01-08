export function formatMoney(amountCents: number) {
    const isNegative = amountCents < 0;
    const absoluteAmount = Math.abs(amountCents);

    const formatted = `$${(absoluteAmount / 100).toFixed(2)}`;
    return isNegative ? `-${formatted}` : formatted;
}