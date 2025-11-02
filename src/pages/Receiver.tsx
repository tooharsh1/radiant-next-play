import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { TransactionHistory } from "@/components/history/TransactionHistory";
import { LogOut, AlertCircle, CheckCircle, Droplet } from "lucide-react";
import {
  getInventory,
  updateInventory,
  addTransaction,
  getUserEmail,
  getUserRole,
  getUserTransactions,
  clearUserSession,
  type Transaction,
} from "@/lib/storage";
import { toast } from "sonner";

export default function Receiver() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("1");
  const [confirmed, setConfirmed] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = getUserEmail();
    const userRole = getUserRole();

    if (!userEmail || userRole !== "Receiver") {
      navigate("/");
      return;
    }

    setEmail(userEmail);
    loadData();
  }, [navigate]);

  const loadData = () => {
    const inv = getInventory();
    setInventory(inv);
    setBloodGroup(Object.keys(inv)[0]);

    const userEmail = getUserEmail();
    if (userEmail) {
      const userTx = getUserTransactions(userEmail);
      setHistory(userTx);
    }
  };

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!confirmed) {
      setError("Please confirm before submitting request");
      return;
    }

    const unitsNum = parseInt(units);
    if (unitsNum < 1 || unitsNum > 10) {
      setError("Please enter units between 1 and 10");
      return;
    }

    const available = inventory[bloodGroup];
    if (unitsNum > available) {
      setError(`Insufficient stock. Only ${available} units available for ${bloodGroup}`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        updateInventory(bloodGroup, -unitsNum);
        addTransaction({
          email,
          role: "Receiver",
          type: "purchase",
          bloodGroup,
          units: unitsNum,
          status: "completed",
        });

        setSuccess(`Successfully received ${unitsNum} unit(s) of ${bloodGroup}`);
        toast.success(`Received ${unitsNum} unit(s) of ${bloodGroup}!`);
        setUnits("1");
        setConfirmed(false);
        loadData();
      } catch (err) {
        setError("Request failed. Please try again.");
        toast.error("Request failed");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleLogout = () => {
    clearUserSession();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 animate-fade-in">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Droplet className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blood Bank</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{email}</p>
              <p className="text-xs text-muted-foreground">Receiver</p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="animate-slide-up">
            <Card className="p-8 border-0 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Request Blood</h2>

              {error && (
                <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRequest} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Blood Group Needed</label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(inventory).map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg} ({inventory[bg]} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Units Required</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="h-12 border-2"
                  />
                  <p className="text-xs text-muted-foreground">Maximum 10 units per request</p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="confirm" className="text-sm text-foreground cursor-pointer leading-relaxed">
                    I confirm that I need to receive this blood and understand the medical implications
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Request"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Inventory and History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-bold text-foreground mb-4">Available Blood Stock</h2>
              <InventoryGrid inventory={inventory} />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Request History</h2>
              <TransactionHistory transactions={history} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
