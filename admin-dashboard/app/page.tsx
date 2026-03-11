'use client';

import { AuthProvider } from '../lib/contexts/AuthContext';

export default function Home() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">
              Ayurveda Wellness Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to the admin dashboard!
            </p>
            <div className="space-y-4">
              <a 
                href="/doctor-approvals"
                className="block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                👥 Doctor Approvals
              </a>
              <a 
                href="/doctors-management"
                className="block bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                👨‍⚕️ Manage Doctors
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
