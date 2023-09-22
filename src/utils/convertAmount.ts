export function convertEuroAmount(amount:number) {

  const convertedAmount = (amount / 100).toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
    
  return convertedAmount.replace('.', ',');
}
  
