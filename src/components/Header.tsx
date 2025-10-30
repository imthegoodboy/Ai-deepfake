import { Shield, Wallet } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-all">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  TrustLens
                </h1>
                <p className="text-xs text-gray-500 leading-none">Verify Truth</p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'upload'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => onNavigate('verify')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'verify'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Verify
              </button>
              <button
                onClick={() => onNavigate('batch')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'batch'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Batch
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Explorer
              </button>
            </nav>
          </div>

          <div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500 font-medium">Connected</p>
                  <p className="text-sm font-mono text-gray-900">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-2 pb-3">
          <button
            onClick={() => onNavigate('upload')}
            className={`flex-1 px-2 py-2 rounded-lg font-medium text-xs transition-all ${
              currentPage === 'upload'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => onNavigate('verify')}
            className={`flex-1 px-2 py-2 rounded-lg font-medium text-xs transition-all ${
              currentPage === 'verify'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Verify
          </button>
          <button
            onClick={() => onNavigate('batch')}
            className={`flex-1 px-2 py-2 rounded-lg font-medium text-xs transition-all ${
              currentPage === 'batch'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Batch
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex-1 px-2 py-2 rounded-lg font-medium text-xs transition-all ${
              currentPage === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Explorer
          </button>
        </nav>
      </div>
    </header>
  );
}
