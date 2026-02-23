"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IconClose } from "@/components/IdxIcons";

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  listPrice: number;
}

const LOAN_TERMS = [30, 20, 15, 10] as const;

const COLORS = {
  principal: "#7EC8E3",
  taxes: "#E8877C",
  hoa: "#E8C77C",
  insurance: "#7C7CE8",
  pmi: "#E8A07C",
};

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calcMonthlyPI(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const payment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Number.isFinite(payment) ? payment : 0;
}

export default function MortgageCalculatorModal({ isOpen, onClose, listPrice }: MortgageCalculatorModalProps) {
  const [purchasePrice, setPurchasePrice] = useState(listPrice);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState(7.5);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [propertyTaxes, setPropertyTaxes] = useState(0);
  const [hoaFees, setHoaFees] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [pmi, setPmi] = useState(0);

  useEffect(() => {
    setPurchasePrice(listPrice);
  }, [listPrice]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  const loanAmount = purchasePrice * (1 - downPaymentPct / 100);
  const monthlyPI = useMemo(
    () => calcMonthlyPI(loanAmount, interestRate, loanTerm),
    [loanAmount, interestRate, loanTerm],
  );

  const totalMonthly = monthlyPI + propertyTaxes + hoaFees + insurance + pmi;

  const segments = useMemo(() => {
    if (totalMonthly <= 0) return [];
    return [
      { label: "Principal & Interest", value: monthlyPI, color: COLORS.principal },
      { label: "Property Taxes", value: propertyTaxes, color: COLORS.taxes },
      { label: "HOA Fees", value: hoaFees, color: COLORS.hoa },
      { label: "Homeowners Insurance", value: insurance, color: COLORS.insurance },
      { label: "Private Mortgage Insurance (PMI)", value: pmi, color: COLORS.pmi },
    ];
  }, [monthlyPI, propertyTaxes, hoaFees, insurance, pmi, totalMonthly]);

  const donutSegments = useMemo(() => {
    if (totalMonthly <= 0) return "none";
    let cumulative = 0;
    const stops: string[] = [];
    for (const seg of segments) {
      const pct = (seg.value / totalMonthly) * 100;
      stops.push(`${seg.color} ${cumulative}% ${cumulative + pct}%`);
      cumulative += pct;
    }
    return `conic-gradient(${stops.join(", ")})`;
  }, [segments, totalMonthly]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", onEsc);
      return () => window.removeEventListener("keydown", onEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
      onClick={handleBackdrop}
    >
      <div className="relative bg-[#f5f5f0] rounded-lg shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-[22px] font-bold text-[#1a1a1a]">Mortgage Calculator</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors text-[#1a1a1a]"
            aria-label="Close"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 px-6 pb-6">
          {/* Left: Inputs */}
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            {/* Purchase Price */}
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Purchase Price</label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-1">
              <span className="px-3 text-sm text-gray-500 bg-gray-50 border-r border-gray-300 py-2">$</span>
              <input
                type="text"
                value={purchasePrice.toLocaleString()}
                onChange={(e) => {
                  const v = Number(e.target.value.replace(/[^0-9]/g, ""));
                  if (Number.isFinite(v)) setPurchasePrice(v);
                }}
                className="w-full px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none"
              />
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(listPrice * 3, 5000000)}
              step={1000}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full h-1 accent-black mb-5"
            />

            {/* Loan Term */}
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">
              Length of Loan <span className="float-right font-normal text-gray-500">Years</span>
            </label>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {LOAN_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setLoanTerm(term)}
                  className={`py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    loanTerm === term
                      ? "bg-black text-white"
                      : "bg-white text-[#1a1a1a] border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Interest Rate */}
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Interest Rate (%)</label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-1">
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={interestRate}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (Number.isFinite(v) && v >= 0 && v <= 20) setInterestRate(v);
                }}
                className="w-full px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none"
              />
              <span className="px-3 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 py-2">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full h-1 accent-black mb-5"
            />

            {/* Down Payment */}
            <label className="block text-[13px] font-semibold text-[#1a1a1a] mb-1.5">Down Payment (%)</label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden mb-1">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={downPaymentPct}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isFinite(v) && v >= 0 && v <= 100) setDownPaymentPct(v);
                }}
                className="w-full px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none"
              />
              <span className="px-3 text-sm text-gray-500 bg-gray-50 border-l border-gray-300 py-2">%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full h-1 accent-black mb-5"
            />

            <button
              type="button"
              onClick={() => {
                setPurchasePrice(listPrice);
                setLoanTerm(30);
                setInterestRate(7.5);
                setDownPaymentPct(20);
                setPropertyTaxes(0);
                setHoaFees(0);
                setInsurance(0);
                setPmi(0);
              }}
              className="w-full bg-black text-white py-3 rounded-md text-sm font-semibold hover:bg-black/90 transition-colors"
            >
              Calculate
            </button>
          </div>

          {/* Right: Breakdown */}
          <div>
            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-4">Monthly Payment Breakdown</h3>

            {/* Donut Chart */}
            <div className="flex justify-center mb-6">
              <div
                className="w-[200px] h-[200px] rounded-full flex items-center justify-center"
                style={{
                  background: donutSegments,
                }}
              >
                <div className="w-[140px] h-[140px] rounded-full bg-[#f5f5f0] flex flex-col items-center justify-center">
                  <span className="text-[11px] text-gray-500">Total Monthly Payment</span>
                  <span className="text-[18px] font-bold text-[#1a1a1a]">{formatUSD(totalMonthly)}</span>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-3">
              {/* Principal & Interest (read-only) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.principal }} />
                  <span className="text-[13px] text-[#1a1a1a]">Principal &amp; Interest</span>
                </div>
                <span className="text-[13px] font-semibold text-[#1a1a1a]">{formatUSD(monthlyPI)}</span>
              </div>

              {/* Editable items */}
              <EditableLineItem label="Property Taxes" color={COLORS.taxes} value={propertyTaxes} onChange={setPropertyTaxes} />
              <EditableLineItem label="HOA Fees" color={COLORS.hoa} value={hoaFees} onChange={setHoaFees} />
              <EditableLineItem label="Homeowners Insurance" color={COLORS.insurance} value={insurance} onChange={setInsurance} />
              <EditableLineItem label="Private Mortgage Insurance (PMI)" color={COLORS.pmi} value={pmi} onChange={setPmi} />
            </div>

            {/* Total */}
            <div className="mt-6 text-center">
              <p className="text-[12px] text-gray-500">Total monthly payment</p>
              <p className="text-[28px] font-bold text-[#1a1a1a]">{formatUSD(totalMonthly)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableLineItem({
  label,
  color,
  value,
  onChange,
}: {
  label: string;
  color: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[13px] text-[#1a1a1a]">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-gray-400">+</span>
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-[80px]">
          <span className="pl-2 text-[12px] text-gray-500">$</span>
          <input
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              onChange(Number.isFinite(v) && v >= 0 ? v : 0);
            }}
            className="w-full px-1 py-1.5 text-[12px] text-[#1a1a1a] focus:outline-none text-right"
          />
        </div>
      </div>
    </div>
  );
}
