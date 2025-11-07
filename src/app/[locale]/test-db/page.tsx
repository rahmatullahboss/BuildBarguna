// Test page to check database connectivity
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function TestDBPage() {
  let dbStatus = "Unknown";
  let userCount = 0;
  let error = null;

  try {
    // Test database connection
    await prisma.$connect();
    userCount = await prisma.user.count();
    dbStatus = "Connected";
  } catch (err: any) {
    dbStatus = "Failed";
    error = err.message;
  } finally {
    await prisma.$disconnect();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Test</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Database Status</h2>
              <p className={`text-sm ${dbStatus === "Connected" ? "text-green-600" : "text-red-600"}`}>
                {dbStatus}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Count</h2>
              <p className="text-sm text-gray-600">{userCount} users in database</p>
            </div>

            {error && (
              <div>
                <h2 className="text-lg font-semibold text-red-900">Error</h2>
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Environment Variables</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? "✅ Set" : "❌ Missing"}</p>
                <p>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"}</p>
                <p>DATABASE_URL: {process.env.DATABASE_URL ? "✅ Set" : "❌ Missing"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check if database is running and accessible</li>
              <li>Verify environment variables in .env.local</li>
              <li>Run: <code className="bg-blue-100 px-1 rounded">npx prisma generate</code></li>
              <li>Run: <code className="bg-blue-100 px-1 rounded">npx prisma db push</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}