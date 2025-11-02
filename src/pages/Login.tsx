import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { AlertCircle, Droplet, Heart, Activity } from "lucide-react";
import { getInventory, setUserEmail, setUserRole } from "@/lib/storage";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [showInventory, setShowInventory] = useState(false);
  const [loading, setLoading] = useState(false);

  const inventory = getInventory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter a valid email");
      return;
    }
    if (!role) {
      setError("Please select a role");
      return;
    }

    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setUserEmail(email);
      setUserRole(role);
      toast.success(`Welcome back, ${email}!`);
      navigate(role === "Donor" ? "/donor" : "/receiver");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-8 pb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Droplet className="w-7 h-7 text-primary-foreground fill-current" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Blood Bank</h1>
              <p className="text-sm text-muted-foreground">Professional Management System</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start pb-12">
          {/* Login Form */}
          <div className="animate-slide-up">
            <Card className="p-8 border-0 shadow-xl">
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
              <p className="text-muted-foreground mb-8">Sign in to manage blood donations and requests</p>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Role</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Donor">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          <span>Donor - Donate Blood</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Receiver">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          <span>Receiver - Request Blood</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo system. Use any email to sign in.
                </p>
              </div>
            </Card>
          </div>

          {/* Right Side - Info */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">Blood Inventory</h3>
                <Button
                  onClick={() => setShowInventory(!showInventory)}
                  variant="outline"
                  size="sm"
                >
                  {showInventory ? "Hide" : "Show"} Stock
                </Button>
              </div>
              {showInventory && <InventoryGrid inventory={inventory} />}
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-4">Why Donate Blood?</h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-xl">•</span>
                  <span>Save lives by donating blood regularly</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-xl">•</span>
                  <span>Help patients in need of blood transfusions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-xl">•</span>
                  <span>Track your donation history and impact</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold text-xl">•</span>
                  <span>Join a community of life-savers</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
