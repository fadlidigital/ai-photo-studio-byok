import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const EmailVerification: React.FC = () => {
  const { user, resendVerificationEmail, signOut } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleResendEmail = async () => {
    setMessage('');
    setError('');
    setSending(true);

    try {
      await resendVerificationEmail();
      setMessage('Email verifikasi telah dikirim ulang! Silakan cek inbox atau folder spam Anda.');
    } catch (err: any) {
      console.error('Resend email error:', err);
      setError('Gagal mengirim email verifikasi. Silakan coba lagi atau tunggu beberapa saat.');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifikasi Email Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Email Anda: <span className="font-medium text-gray-900">{user?.email}</span>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Email Verifikasi Telah Dikirim
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Kami telah mengirimkan email verifikasi ke alamat email Anda. Silakan:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Buka inbox email Anda</li>
                  <li>Cari email dari Supabase/AI Foto Estetik</li>
                  <li>Klik link verifikasi di email tersebut</li>
                  <li>Kembali ke halaman ini dan klik tombol "Saya Sudah Verifikasi"</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ✅ Saya Sudah Verifikasi Email
          </button>

          <button
            onClick={handleResendEmail}
            disabled={sending}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '📤 Mengirim...' : '📧 Kirim Ulang Email Verifikasi'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-3 px-4 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            🚪 Keluar
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Tips:</strong> Jika tidak menemukan email, cek folder spam/junk Anda.
                Email mungkin memerlukan beberapa menit untuk sampai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
