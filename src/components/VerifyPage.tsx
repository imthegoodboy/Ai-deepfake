import { useState } from 'react';
import { Search, FileText, Upload, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase, VerifiedContent } from '../lib/supabase';
import { generateHash, generateTextHash } from '../lib/crypto';

export function VerifyPage() {
  const [verifyMode, setVerifyMode] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    status: 'verified' | 'unverified' | 'suspicious';
    content?: VerifiedContent;
    hash: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleVerify = async () => {
    setChecking(true);
    setResult(null);

    try {
      let hash: string;

      if (verifyMode === 'text') {
        if (!textContent.trim()) {
          alert('Please provide text content');
          return;
        }
        hash = await generateTextHash(textContent);
      } else {
        if (!file) {
          alert('Please select a file');
          return;
        }
        hash = await generateHash(file);
      }

      const { data, error } = await supabase
        .from('verified_content')
        .select('*')
        .eq('content_hash', hash)
        .maybeSingle();

      if (error) throw error;

      await supabase.from('verification_checks').insert({
        checked_hash: hash,
        matched_content_id: data?.id || null,
        check_result: data ? 'verified' : 'unverified'
      });

      if (data) {
        setResult({
          status: data.verification_status === 'flagged' ? 'suspicious' : 'verified',
          content: data,
          hash
        });
      } else {
        setResult({
          status: 'unverified',
          hash
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to verify content');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Check Content Authenticity</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { setVerifyMode('file'); setResult(null); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                verifyMode === 'file'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Upload className={`w-8 h-8 mx-auto mb-2 ${verifyMode === 'file' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${verifyMode === 'file' ? 'text-blue-600' : 'text-gray-600'}`}>
                Upload File
              </span>
            </button>
            <button
              onClick={() => { setVerifyMode('text'); setResult(null); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                verifyMode === 'text'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className={`w-8 h-8 mx-auto mb-2 ${verifyMode === 'text' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${verifyMode === 'text' ? 'text-blue-600' : 'text-gray-600'}`}>
                Check Text
              </span>
            </button>
          </div>
        </div>

        {verifyMode === 'file' ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Content to Verify</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="verify-file-upload"
              />
              <label htmlFor="verify-file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-1">Click to upload file</p>
                <p className="text-sm text-gray-500">{file ? file.name : 'No file selected'}</p>
              </label>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Text Content to Verify</label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste text content here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={checking}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking Blockchain...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Verify Content
            </>
          )}
        </button>

        {result && (
          <div className={`mt-8 rounded-xl p-6 border-2 ${
            result.status === 'verified'
              ? 'bg-green-50 border-green-200'
              : result.status === 'suspicious'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              {result.status === 'verified' ? (
                <CheckCircle2 className="w-12 h-12 text-green-600 flex-shrink-0" />
              ) : result.status === 'suspicious' ? (
                <AlertTriangle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
              )}

              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${
                  result.status === 'verified'
                    ? 'text-green-900'
                    : result.status === 'suspicious'
                    ? 'text-yellow-900'
                    : 'text-red-900'
                }`}>
                  {result.status === 'verified'
                    ? 'Verified Original Content'
                    : result.status === 'suspicious'
                    ? 'Suspicious Content'
                    : 'Unverified Content'}
                </h3>
                <p className={`mb-4 ${
                  result.status === 'verified'
                    ? 'text-green-700'
                    : result.status === 'suspicious'
                    ? 'text-yellow-700'
                    : 'text-red-700'
                }`}>
                  {result.status === 'verified'
                    ? 'This content has been verified on the blockchain and matches an original submission.'
                    : result.status === 'suspicious'
                    ? 'This content is flagged as suspicious. It may have been altered or manipulated.'
                    : 'This content does not match any verified records on the blockchain. It may be fake, altered, or simply not yet registered.'}
                </p>

                {result.content && (
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Title:</span>
                      <p className="text-gray-900">{result.content.title}</p>
                    </div>
                    {result.content.description && (
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Description:</span>
                        <p className="text-gray-900">{result.content.description}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Creator:</span>
                      <p className="text-gray-900">{result.content.creator_name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Wallet Address:</span>
                      <p className="text-gray-900 font-mono text-xs break-all">{result.content.wallet_address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Verified On:</span>
                      <p className="text-gray-900">{new Date(result.content.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Transaction Hash:</span>
                      <p className="text-gray-900 font-mono text-xs break-all">{result.content.blockchain_tx_hash}</p>
                    </div>
                    {result.content.ai_verification_score !== null && (
                      <div>
                        <span className="text-sm font-semibold text-gray-700">AI Verification Score:</span>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                result.content.ai_verification_score >= 70
                                  ? 'bg-green-600'
                                  : result.content.ai_verification_score >= 40
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${result.content.ai_verification_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {result.content.ai_verification_score}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 bg-gray-100 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700 block mb-1">Content Hash:</span>
                  <p className="text-xs font-mono text-gray-900 break-all">{result.hash}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
