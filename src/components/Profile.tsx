import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../services/storage';
import ApiKeyManager from './ApiKeyManager';
import UsageStats from './UsageStats';

interface ProfileProps {
  onApiKeyChange?: (key: string | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ onApiKeyChange }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [usageStats, setUsageStats] = useState(storage.getUsageStats());
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  useEffect(() => {
    // Update stats periodically
    const interval = setInterval(() => {
      setUsageStats(storage.getUsageStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600">
            Kelola informasi akun dan pengaturan API Anda
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informasi Akun
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-lg font-semibold text-gray-800">{user?.email}</div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                  <div className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded">
                    {user?.id}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status Verifikasi</label>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user?.email_confirmed_at
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user?.email_confirmed_at ? '✓ Terverifikasi' : '⚠ Belum Verifikasi'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="mb-6">
          <ApiKeyManager onApiKeyChange={onApiKeyChange || (() => {})} />
        </div>

        {/* Usage Stats */}
        <div className="mb-6">
          <UsageStats stats={usageStats} />
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pengaturan Akun
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowConfirmLogout(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar dari Akun
            </button>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        {showConfirmLogout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Konfirmasi Logout</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin keluar dari akun? Anda perlu login kembali untuk menggunakan aplikasi.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
