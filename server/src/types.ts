export interface User {
  id: number
  phone: string
  name: string | null
  created_at: string
}

export interface Expense {
  id: number
  user_id: number
  amount: number
  currency: string
  category: string
  description: string
  raw_message: string
  expense_date: string
  created_at: string
  // joined
  user_phone?: string
  user_name?: string | null
}

export interface ParsedExpense {
  amount: number
  currency: string
  category: string
  description: string
}

export interface Stats {
  totalAmount: number
  expenseCount: number
  userCount: number
  byCategory: { category: string; total: number }[]
  byMonth: { month: string; total: number }[]
  topUsers: { phone: string; name: string | null; total: number }[]
}
