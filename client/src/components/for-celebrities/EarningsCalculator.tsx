import type { Dispatch, SetStateAction } from 'react';

interface EarningsCalculatorProps {
  meetings: number;
  setMeetings: Dispatch<SetStateAction<number>>;
  price: number;
  setPrice: Dispatch<SetStateAction<number>>;
}

export const EarningsCalculator = ({
  meetings,
  setMeetings,
  price,
  setPrice,
}: EarningsCalculatorProps) => {
  const monthlyEarnings = Math.round(meetings * price * 0.85);
  const annualEarnings = monthlyEarnings * 12;

  return (
    <section className="calculator-section">
      <h2>See your earning potential</h2>
      <p>Thousands of celebrities are earning life-changing income</p>
      <div className="calc-controls">
        <div className="calc-control">
          <label>Meetings per month</label>
          <input
            type="number"
            value={meetings}
            min="1"
            max="100"
            onChange={(e) => setMeetings(Number(e.target.value))}
          />
        </div>
        <div className="calc-control">
          <label>Price per meeting ($)</label>
          <input
            type="number"
            value={price}
            min="100"
            step="100"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="calc-result">
        <div className="calc-result-label">You could earn</div>
        <div className="calc-result-amount">${monthlyEarnings.toLocaleString()}</div>
        <div className="calc-result-subtext">
          per month · ${annualEarnings.toLocaleString()} per year
        </div>
      </div>
    </section>
  );
};
