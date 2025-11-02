import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Transaction {
  id: number;
  email: string;
  role: string;
  type: string;
  bloodGroup: string;
  units: number;
  status: string;
  ts: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No transactions yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                {getStatusIcon(transaction.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{transaction.bloodGroup}</span>
                  <Badge variant={getStatusVariant(transaction.status)} className="capitalize">
                    {transaction.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {transaction.type === "donate" ? "Donated" : "Requested"} {transaction.units} unit
                  {transaction.units !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(transaction.ts)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{transaction.units}</p>
              <p className="text-xs text-muted-foreground">units</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
