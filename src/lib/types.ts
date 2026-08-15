export type Currency = "NZD" | "PKR";

export type Category =
  | "Rent"
  | "Groceries"
  | "Transport"
  | "Utilities"
  | "Medical Registration/Fees"
  | "Family Remittance"
  | "Dining Out"
  | "Insurance"
  | "Study/CME"
  | "Savings"
  | "Donations"
  | "Loan Repayment"
  | "Loan Given"
  | "Fitness/Equipment"
  | "Other";

export const CATEGORIES: Category[] = [
  "Rent",
  "Groceries",
  "Transport",
  "Utilities",
  "Medical Registration/Fees",
  "Family Remittance",
  "Dining Out",
  "Insurance",
  "Study/CME",
  "Savings",
  "Donations",
  "Loan Repayment",
  "Loan Given",
  "Fitness/Equipment",
  "Other",
];

// Categories that involve tracking a date owed/expected in the future
export const LOAN_CATEGORIES: Category[] = ["Loan Repayment", "Loan Given"];

export function isLoanCategory(category: Category): boolean {
  return LOAN_CATEGORIES.includes(category);
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  currency: Currency;
  amountInNZD: number;
  rateUsed: number;
  category: Category;
  note: string;
  createdAt: string;
  // Only used for "Loan Repayment" (when you owe money — the date you must pay it back)
  // and "Loan Given" (money you lent — the date you expect it returned)
  dueDate?: string | null;
}

export interface BudgetMap {
  [category: string]: number;
}

export interface Settings {
  rate: number;
  monthlyIncome: number;
  remittanceTarget: number;
  name: string;
}

export const DEFAULT_SETTINGS: Settings = {
  rate: 79.5,
  monthlyIncome: 9000,
  remittanceTarget: 1500,
  name: "",
};

export const DEFAULT_BUDGETS: BudgetMap = {
  Rent: 2400,
  Groceries: 700,
  Transport: 250,
  Utilities: 300,
  "Medical Registration/Fees": 200,
  "Family Remittance": 1500,
  "Dining Out": 250,
  Insurance: 150,
  "Study/CME": 200,
  Savings: 1000,
  Donations: 150,
  "Loan Repayment": 300,
  "Loan Given": 200,
  "Fitness/Equipment": 150,
  Other: 200,
};
