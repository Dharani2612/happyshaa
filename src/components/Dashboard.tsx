import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, AlertTriangle, Heart, Activity, Brain, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const moodData = [
  { day: "Mon", mood: 3, activities: 4 },
  { day: "Tue", mood: 4, activities: 5 },
  { day: "Wed", mood: 2, activities: 3 },
  { day: "Thu", mood: 4, activities: 6 },
  { day: "Fri", mood: 5, activities: 4 },
  { day: "Sat", mood: 4, activities: 7 },
  { day: "Sun", mood: 3, activities: 5 },
];

const activityData = [
  { name: "Exercise", value: 25, color: "#60A5FA" },
  { name: "Meditation", value: 20, color: "#34D399" },
  { name: "Social", value: 15, color: "#F472B6" },
  { name: "Work", value: 30, color: "#FBBF24" },
  { name: "Rest", value: 10, color: "#A78BFA" },
];

const alertData = [
  { 
    type: "warning", 
    message: "Mood dipped to 2/5 on Wednesday",
    recommendation: "Consider scheduling a check-in or practicing breathing exercises",
    time: "2 days ago"
  },
  {
    type: "positive",
    message: "Consistent exercise routine detected",
    recommendation: "Great work maintaining healthy habits!",
    time: "Today"
  },
];

export const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-gentle border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Wellbeing</p>
              <p className="text-xl font-bold text-foreground">Good</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-gentle border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-calm flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">7-Day Average</p>
              <p className="text-xl font-bold text-foreground">3.6/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-gentle border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-healing flex items-center justify-center">
              <Activity className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Days</p>
              <p className="text-xl font-bold text-foreground">6/7</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-gentle border-primary/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mindful Minutes</p>
              <p className="text-xl font-bold text-foreground">180</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <Card className="p-6 shadow-therapeutic border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Mood Trends (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                domain={[1, 5]} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Distribution */}
        <Card className="p-6 shadow-therapeutic border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Insights & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="p-6 shadow-gentle border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Activity Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey="activities" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Smart Insights */}
        <Card className="p-6 shadow-gentle border-primary/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Smart Insights & Alerts</h3>
          <div className="space-y-4">
            {alertData.map((alert, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border border-border/50 bg-gradient-healing"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${
                    alert.type === "warning" ? "bg-destructive/20" : "bg-primary/20"
                  }`}>
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <Heart className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.recommendation}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                      <Badge 
                        variant="secondary" 
                        className={alert.type === "warning" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}
                      >
                        {alert.type === "warning" ? "Monitor" : "Positive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Assessment Summary */}
      <Card className="p-6 shadow-therapeutic border-primary/10 bg-gradient-healing">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Wellness Summary</h3>
            <p className="text-sm text-muted-foreground">AI-powered insights from behavioral patterns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-card/50 rounded-lg">
            <div className="text-2xl mb-2">🟢</div>
            <p className="text-sm font-medium text-foreground">Risk Level</p>
            <p className="text-xs text-muted-foreground">Low - Stable patterns detected</p>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <p className="text-sm font-medium text-foreground">Trend</p>
            <p className="text-xs text-muted-foreground">Improving with consistent habits</p>
          </div>
          <div className="text-center p-4 bg-card/50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium text-foreground">Next Goal</p>
            <p className="text-xs text-muted-foreground">Maintain current routine</p>
          </div>
        </div>
      </Card>
    </div>
  );
};