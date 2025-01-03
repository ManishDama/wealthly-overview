import { useState } from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { MonthlyExpenseChart } from "@/components/dashboard/MonthlyExpenseChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Transaction {
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const navigate = useNavigate();
  const { currency, setCurrency, currencies } = useCurrency();

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = income - totalExpenses;

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <Select
              value={currency.code}
              onValueChange={(value) => {
                const newCurrency = currencies.find((c) => c.code === value);
                if (newCurrency) setCurrency(newCurrency);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Monthly Income:</h2>
            {isEditingIncome ? (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-32"
                />
                <Button
                  onClick={() => setIsEditingIncome(false)}
                  variant="outline"
                  size="sm"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{currency.symbol}{income.toFixed(2)}</span>
                <Button
                  onClick={() => setIsEditingIncome(true)}
                  variant="outline"
                  size="sm"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          <DashboardMetrics
            income={income}
            expenses={totalExpenses}
            balance={balance}
          />

          <div className="grid md:grid-cols-2 gap-8">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <ExpenseChart transactions={transactions} />
          </div>

          <MonthlyExpenseChart transactions={transactions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;