import yahooFinance from 'yahoo-finance2';

const instance = new yahooFinance();

console.log('Testing quote method...\n');
try {
  const result = await instance.quote('AAPL');
  console.log('Quote result for AAPL:');
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error('Quote error:', error);
}
