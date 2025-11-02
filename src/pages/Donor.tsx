import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function Donor() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("1");
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Transaction[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = getUserEmail();
    const userRole = getUserRole();

    if (!userEmail || userRole !== "Donor") {
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

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const unitsNum = parseInt(units);
    if (unitsNum < 1 || unitsNum > 5) {
      setError("Please enter units between 1 and 5");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        updateInventory(bloodGroup, unitsNum);
        addTransaction({
          email,
          role: "Donor",
          type: "donate",
          bloodGroup,
          units: unitsNum,
          status: "completed",
        });

        setSuccess(`Successfully donated ${unitsNum} unit(s) of ${bloodGroup}`);
        toast.success(`Donated ${unitsNum} unit(s) of ${bloodGroup}!`);
        setUnits("1");
        loadData();
      } catch (err) {
        setError("Donation failed. Please try again.");
        toast.error("Donation failed");
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
              <p className="text-xs text-muted-foreground">Donor</p>
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
          {/* Donation Form */}
          <div className="animate-slide-up">
            <Card className="p-8 border-0 shadow-xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Donate Blood</h2>

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

              <form onSubmit={handleDonate} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Your Blood Group</label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(inventory).map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Units to Donate</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="h-12 border-2"
                  />
                  <p className="text-xs text-muted-foreground">Maximum 5 units per donation</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Donation"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Inventory and History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-bold text-foreground mb-4">Current Blood Inventory</h2>
              <InventoryGrid inventory={inventory} />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Donation History</h2>
              <TransactionHistory transactions={history} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
