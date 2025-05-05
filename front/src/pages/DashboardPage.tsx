import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { orders, inventory } from "@/api/adminService";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  Package2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { admin } = useAuth();
  const [orderStats, setOrderStats] = useState<any>(null);
  const [inventoryAlerts, setInventoryAlerts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load order stats
        const orderStatsData = await orders.getOrderStats();
        setOrderStats(orderStatsData.data);

        // Load inventory alerts
        const inventoryAlertsData = await inventory.getInventoryAlerts();
        setInventoryAlerts(inventoryAlertsData.data);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-10">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center py-10">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
        <p className="text-center text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {admin?.firstName || "Admin"}
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your store's performance
        </p>
      </div>

      {/* Inventory Alerts Banner */}
      {inventoryAlerts && inventoryAlerts.count > 0 && (
        <Card
          className={`p-4 ${inventoryAlerts.outOfStockCount > 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle
                className={`mr-2 h-5 w-5 ${inventoryAlerts.outOfStockCount > 0 ? "text-red-500" : "text-amber-500"}`}
              />
              <div>
                <h3
                  className={`font-medium ${inventoryAlerts.outOfStockCount > 0 ? "text-red-700" : "text-amber-700"}`}
                >
                  Inventory Alert
                </h3>
                <p
                  className={`text-sm ${inventoryAlerts.outOfStockCount > 0 ? "text-red-600" : "text-amber-600"}`}
                >
                  {inventoryAlerts.outOfStockCount > 0
                    ? `${inventoryAlerts.outOfStockCount} products out of stock, ${inventoryAlerts.lowStockCount} products low on stock`
                    : `${inventoryAlerts.lowStockCount} products low on stock`}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className={
                inventoryAlerts.outOfStockCount > 0
                  ? "border-red-200 text-red-700 hover:bg-red-100"
                  : "border-amber-200 text-amber-700 hover:bg-amber-100"
              }
            >
              <Link to="/products">
                View Inventory <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Low Stock Items */}
      {inventoryAlerts && inventoryAlerts.count > 0 && (
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <Package2 className="mr-2 h-5 w-5 text-primary" />
            <h3 className="font-medium">Low Stock Items</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {inventoryAlerts.alerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center border-b pb-3">
                <div
                  className="h-12 w-12 rounded-md mr-3 flex-shrink-0 bg-gray-100"
                  style={{
                    backgroundImage: alert.image
                      ? `url(${alert.image})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm truncate">
                      {alert.productName}
                    </p>
                    <Badge
                      variant={
                        alert.status === "OUT_OF_STOCK"
                          ? "destructive"
                          : "outline"
                      }
                      className={
                        alert.status === "OUT_OF_STOCK"
                          ? ""
                          : "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                      }
                    >
                      {alert.status === "OUT_OF_STOCK"
                        ? "Out of Stock"
                        : `${alert.stock} left`}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="truncate">
                      {[alert.flavor, alert.weight].filter(Boolean).join(" • ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {inventoryAlerts.count > 5 && (
            <div className="mt-3 text-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/products">
                  View all {inventoryAlerts.count} items
                </Link>
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Orders */}
        <Card className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Orders
            </p>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{orderStats?.totalOrders || 0}</p>
          </div>
          <div className="mt-2 flex items-center text-xs">
            {orderStats?.orderGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  {orderStats?.orderGrowth}% increase
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">
                  {Math.abs(orderStats?.orderGrowth || 0)}% decrease
                </span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">vs. last month</span>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </p>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">
              ₹{orderStats?.totalSales?.toLocaleString() || 0}
            </p>
          </div>
          <div className="mt-2 flex items-center text-xs">
            {orderStats?.revenueGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  {orderStats?.revenueGrowth}% increase
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">
                  {Math.abs(orderStats?.revenueGrowth || 0)}% decrease
                </span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">vs. last month</span>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      {orderStats?.topProducts && orderStats.topProducts.length > 0 && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Top Selling Products</h3>
            <p className="text-sm text-muted-foreground">
              Most popular products by sales volume
            </p>
          </div>
          <div className="space-y-4">
            {orderStats.topProducts.map((product: any) => (
              <div
                key={product.id}
                className="flex items-center space-x-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div
                  className="h-16 w-16 rounded-md bg-muted/50"
                  style={{
                    backgroundImage:
                      product.images && product.images[0]
                        ? `url(${
                            product.images[0].url.startsWith("http")
                              ? product.images[0].url
                              : `${process.env.REACT_APP_API_URL || ""}/${product.images[0].url}`
                          })`
                        : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span className="mr-3">
                          <span className="font-medium text-foreground">
                            {product.quantitySold || 0}
                          </span>{" "}
                          sold
                        </span>
                        <span>
                          <span className="font-medium text-foreground">
                            ₹{parseFloat(product.revenue).toLocaleString() || 0}
                          </span>{" "}
                          revenue
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        asChild
                      >
                        <Link to={`/products/${product.id}`}>Edit</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        asChild
                      >
                        <Link to={`/products/${product.id}`}>Inventory</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Order Status Distribution */}
      {orderStats?.statusCounts &&
        Object.keys(orderStats.statusCounts).length > 0 && (
          <Card className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Order Status Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Current status of orders
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(orderStats.statusCounts).map(
                ([status, count]) => {
                  // Define colors for different statuses
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case "PENDING":
                        return "bg-yellow-100 text-yellow-800 border-yellow-200";
                      case "PROCESSING":
                        return "bg-blue-100 text-blue-800 border-blue-200";
                      case "PAID":
                        return "bg-emerald-100 text-emerald-800 border-emerald-200";
                      case "SHIPPED":
                        return "bg-indigo-100 text-indigo-800 border-indigo-200";
                      case "DELIVERED":
                        return "bg-green-100 text-green-800 border-green-200";
                      case "CANCELLED":
                        return "bg-red-100 text-red-800 border-red-200";
                      case "REFUNDED":
                        return "bg-purple-100 text-purple-800 border-purple-200";
                      default:
                        return "bg-gray-100 text-gray-800 border-gray-200";
                    }
                  };

                  return (
                    <div
                      key={status}
                      className={`border rounded-lg p-3 ${getStatusColor(status)}`}
                    >
                      <div className="text-sm font-medium">{status}</div>
                      <div className="text-xl font-bold mt-1">
                        {count as number}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>
        )}

      {/* Revenue Chart */}
      {orderStats?.monthlySales && orderStats.monthlySales.length > 0 && (
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Revenue Over Time</h3>
            <p className="text-sm text-muted-foreground">
              Monthly revenue for the past 6 months
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={orderStats.monthlySales}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.substring(0, 3)}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
