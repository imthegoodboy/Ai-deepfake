import { Shield, Upload, Search, Database, Zap, Lock, Globe } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold">Powered by Polygon Mumbai & Multi-Layer AI</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Verify the Truth in a<br />World Full of Fakes
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              TrustLens uses blockchain verification and AI detection to authenticate content
              and fight misinformation in the digital age
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('upload')}
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Verify Your Content
              </button>
              <button
                onClick={() => onNavigate('verify')}
                className="bg-blue-800/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800/70 transition-all border-2 border-white/20 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Check Authenticity
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How TrustLens Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to verify authenticity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full border border-blue-200">
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Upload Content</h3>
                <p className="text-gray-600 leading-relaxed">
                  Creators and journalists upload their original images, videos, or text to generate a unique cryptographic hash
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 h-full border border-green-200">
                <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Blockchain Verification</h3>
                <p className="text-gray-600 leading-relaxed">
                  The content hash is timestamped and stored on Polygon blockchain with creator's wallet address for permanent verification
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full border border-purple-200">
                <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Verify & Check</h3>
                <p className="text-gray-600 leading-relaxed">
                  Anyone can verify content authenticity by uploading it. Our AI detects deepfakes and blockchain confirms originality
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why TrustLens?</h2>
            <p className="text-xl text-gray-600">Built for trust in the AI era</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Immutable Records</h3>
              <p className="text-gray-600 text-sm">
                Blockchain ensures verification records cannot be altered or deleted
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <Zap className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Detection</h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms detect deepfakes and manipulated content
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <Database className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Decentralized Storage</h3>
              <p className="text-gray-600 text-sm">
                Content stored on Filecoin for permanent, censorship-resistant access
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <Globe className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Public Verification</h3>
              <p className="text-gray-600 text-sm">
                Anyone can verify content authenticity without special access
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Fight Misinformation?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join journalists, creators, and truth-seekers using TrustLens to verify authentic content
          </p>
          <button
            onClick={() => onNavigate('upload')}
            className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Start Verifying Now
          </button>
        </div>
      </section>
    </div>
  );
}
