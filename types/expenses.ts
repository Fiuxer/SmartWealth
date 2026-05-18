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