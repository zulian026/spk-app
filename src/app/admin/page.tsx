// app/admin/page.tsx
"use client";

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Users",
            value: "1,234",
            change: "+12%",
            color: "blue",
          },
          {
            title: "Active Sessions",
            value: "89",
            change: "+5%",
            color: "green",
          },
          {
            title: "Revenue",
            value: "$12,345",
            change: "+8%",
            color: "purple",
          },
          {
            title: "Support Tickets",
            value: "23",
            change: "-3%",
            color: "red",
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              "New user registered: john@example.com",
              "System backup completed successfully",
              "New support ticket created",
              "User data exported",
              "Security scan completed",
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">{activity}</span>
                <span className="text-sm text-gray-500 ml-auto">
                  {index + 1}h ago
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
