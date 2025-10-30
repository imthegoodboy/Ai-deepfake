import { useState, useEffect } from 'react';
import { Database, FileText, Image, Video, ExternalLink, Shield, TrendingUp } from 'lucide-react';
import { supabase, VerifiedContent } from '../lib/supabase';

export function DashboardPage() {
  const [contents, setContents] = useState<VerifiedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    images: 0,
    videos: 0,
    texts: 0
  });

  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    try {
      const { data, error } = await supabase
        .from('verified_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContents(data || []);

      const images = data?.filter(c => c.content_type === 'image').length || 0;
      const videos = data?.filter(c => c.content_type === 'video').length || 0;
      const texts = data?.filter(c => c.content_type === 'text').length || 0;

      setStats({
        total: data?.length || 0,
        images,
        videos,
        texts
      });
    } catch (error) {
      console.error('Error loading contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verified Content Explorer</h2>
        <p className="text-gray-600">Browse all content verified on the blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Database className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.total}</div>
          <div className="text-blue-100 text-sm font-medium">Total Verified</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Image className="w-8 h-8 opacity-80" />
            <Shield className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.images}</div>
          <div className="text-green-100 text-sm font-medium">Images</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Video className="w-8 h-8 opacity-80" />
            <Shield className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.videos}</div>
          <div className="text-purple-100 text-sm font-medium">Videos</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-8 h-8 opacity-80" />
            <Shield className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.texts}</div>
          <div className="text-orange-100 text-sm font-medium">Texts</div>
        </div>
      </div>

      {contents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Verified Content Yet</h3>
          <p className="text-gray-600">Upload your first piece of content to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div
              key={content.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className={`h-2 ${
                content.verification_status === 'verified'
                  ? 'bg-green-500'
                  : content.verification_status === 'flagged'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}></div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    content.content_type === 'image'
                      ? 'bg-green-100 text-green-600'
                      : content.content_type === 'video'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {getContentIcon(content.content_type)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    content.verification_status === 'verified'
                      ? 'bg-green-100 text-green-700'
                      : content.verification_status === 'flagged'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {content.verification_status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {content.title}
                </h3>

                {content.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {content.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Creator:</span>
                    <span className="font-medium text-gray-900">{content.creator_name}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Verified:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(content.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {content.ai_verification_score !== null && (
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">AI Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              content.ai_verification_score >= 70
                                ? 'bg-green-500'
                                : content.ai_verification_score >= 40
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${content.ai_verification_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {content.ai_verification_score}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-mono truncate flex-1 mr-2">
                      {content.wallet_address.slice(0, 6)}...{content.wallet_address.slice(-4)}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(content.blockchain_tx_hash);
                        alert('Transaction hash copied!');
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      TX
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
