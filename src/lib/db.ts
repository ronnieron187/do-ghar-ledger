"use client";

import { createClient } from "@/lib/supabase/client";
import { BudgetMap, DEFAULT_BUDGETS, DEFAULT_SETTINGS, Expense, Settings } from "@/lib/types";

const supabase = createClient();

function rowToExpense(row: any): Expense {
  return {
    id: row.id,
    date: row.date,
    amount: Number(row.amount),
    currency: row.currency,
    amountInNZD: Number(row.amount_in_nzd),
    rateUsed: Number(row.rate_used),
    category: row.category,
    note: row.note ?? "",
    createdAt: row.created_at,
    dueDate: row.due_date ?? null,
  };
}

export const db = {
  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      console.error("getExpenses error", error);
      return [];
    }
    return (data ?? []).map(rowToExpense);
  },

  async addExpense(expense: Expense, userId: string): Promise<Expense | null> {
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        date: expense.date,
        amount: expense.amount,
        currency: expense.currency,
        amount_in_nzd: expense.amountInNZD,
        rate_used: expense.rateUsed,
        category: expense.category,
        note: expense.note,
        due_date: expense.dueDate ?? null,
      })
      .select()
      .single();
    if (error) {
      console.error("addExpense error", error);
      return null;
    }
    return rowToExpense(data);
  },

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      console.error("deleteExpense error", error);
      return false;
    }
    return true;
  },

  async getProfile(userId: string): Promise<{ settings: Settings; budgets: BudgetMap }> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return { settings: DEFAULT_SETTINGS, budgets: DEFAULT_BUDGETS };
    }

    return {
      settings: {
        name: data.name ?? "",
        rate: Number(data.rate ?? DEFAULT_SETTINGS.rate),
        monthlyIncome: Number(data.monthly_income ?? DEFAULT_SETTINGS.monthlyIncome),
        remittanceTarget: Number(
          data.remittance_target ?? DEFAULT_SETTINGS.remittanceTarget
        ),
      },
      budgets:
        data.budgets && Object.keys(data.budgets).length > 0
          ? data.budgets
          : DEFAULT_BUDGETS,
    };
  },

  async saveProfile(
    userId: string,
    settings: Settings,
    budgets: BudgetMap
  ): Promise<boolean> {
    const { error } = await supabase.from("profiles").upsert({
      user_id: userId,
      name: settings.name,
      rate: settings.rate,
      monthly_income: settings.monthlyIncome,
      remittance_target: settings.remittanceTarget,
      budgets,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("saveProfile error", error);
      return false;
    }
    return true;
  },
};
