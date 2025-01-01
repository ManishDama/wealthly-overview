import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Transaction {
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface MonthlyExpenseChartProps {
  transactions: Transaction[];
}

export const MonthlyExpenseChart = ({ transactions }: MonthlyExpenseChartProps) => {
  const { formatAmount } = useCurrency();
  
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatAmount(value)} />
            <Tooltip
              formatter={(value: number) => [formatAmount(value), "Amount"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};