import { useState } from 'react';
import { WalletProvider } from './contexts/WalletContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { EnhancedUploadPage } from './components/EnhancedUploadPage';
import { VerifyPage } from './components/VerifyPage';
import { DashboardPage } from './components/DashboardPage';
import { BatchVerificationPage } from './components/BatchVerificationPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'upload':
        return <EnhancedUploadPage />;
      case 'verify':
        return <VerifyPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'batch':
        return <BatchVerificationPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        {currentPage !== 'home' && (
          <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        )}
        {currentPage === 'home' && (
          <div className="absolute top-0 left-0 right-0 z-50">
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
          </div>
        )}
        <main className={currentPage !== 'home' ? 'pb-12' : ''}>
          {renderPage()}
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
