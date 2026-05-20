export type Expense = {
  name?: string
  description?: string
  amount: number
}

export type ExpenseList = Expense[]

export type Reminder = {
  name: string
  amount: number
  last_reminder?: Date
  interval: number
}

export type WindowData = {
  name: string,
  date?: Date,
  description?: string,
  amount?: number,
  frequency?: string,
  category?: string,
  reminder?: boolean,
  type?: string,
}