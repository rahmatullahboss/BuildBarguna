// Test page to check authentication state
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function TestAuthPage() {
  const session = await auth();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      {session ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold text-green-800">✅ Authenticated!</h2>
          <div className="mt-2">
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Role:</strong> {session.user?.role}</p>
          </div>
          <div className="mt-4">
            <a href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Go to Admin Panel
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded">
          <h2 className="text-lg font-semibold text-red-800">❌ Not Authenticated</h2>
          <p className="mt-2">You are not signed in.</p>
          <div className="mt-4">
            <a href="/auth/signin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign In
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold">Session Data (Raw):</h3>
        <pre className="mt-2 text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}