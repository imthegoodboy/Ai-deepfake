import { useState } from 'react';
import { Upload, CheckCircle2, XCircle, Loader2, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generateHash } from '../lib/crypto';

interface BatchResult {
  filename: string;
  hash: string;
  status: 'verified' | 'unverified' | 'processing';
  matchedContent?: {
    title: string;
    creator: string;
    timestamp: string;
  };
}

export function BatchVerificationPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setResults([]);
    }
  };

  const handleBatchVerify = async () => {
    if (files.length === 0) {
      alert('Please select files to verify');
      return;
    }

    setProcessing(true);
    const newResults: BatchResult[] = [];

    for (const file of files) {
      const initialResult: BatchResult = {
        filename: file.name,
        hash: '',
        status: 'processing'
      };
      newResults.push(initialResult);
      setResults([...newResults]);

      try {
        const hash = await generateHash(file);
        const { data, error } = await supabase
          .from('verified_content')
          .select('title, creator_name, created_at')
          .eq('content_hash', hash)
          .maybeSingle();

        if (error) throw error;

        const resultIndex = newResults.findIndex(r => r.filename === file.name);
        if (data) {
          newResults[resultIndex] = {
            filename: file.name,
            hash,
            status: 'verified',
            matchedContent: {
              title: data.title,
              creator: data.creator_name,
              timestamp: data.created_at
            }
          };
        } else {
          newResults[resultIndex] = {
            filename: file.name,
            hash,
            status: 'unverified'
          };
        }

        setResults([...newResults]);
      } catch (error) {
        console.error('Verification error:', error);
        const resultIndex = newResults.findIndex(r => r.filename === file.name);
        newResults[resultIndex].status = 'unverified';
        setResults([...newResults]);
      }
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Batch Verification</h2>
        <p className="text-gray-600 mb-6">Verify multiple files at once to check their authenticity</p>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Multiple Files</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFilesSelect}
              className="hidden"
              id="batch-file-upload"
            />
            <label htmlFor="batch-file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-1">Click to select multiple files</p>
              <p className="text-sm text-gray-500">{files.length > 0 ? `${files.length} files selected` : 'No files selected'}</p>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Selected Files</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleBatchVerify}
          disabled={processing || files.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying {files.length} Files...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Verify All Files
            </>
          )}
        </button>

        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Verification Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === 'verified'
                      ? 'bg-green-50 border-green-200'
                      : result.status === 'unverified'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.status === 'verified' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : result.status === 'unverified' ? (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{result.filename}</div>
                      {result.status === 'verified' && result.matchedContent && (
                        <div className="mt-2 text-sm text-gray-700">
                          <div><span className="font-medium">Title:</span> {result.matchedContent.title}</div>
                          <div><span className="font-medium">Creator:</span> {result.matchedContent.creator}</div>
                          <div><span className="font-medium">Verified:</span> {new Date(result.matchedContent.timestamp).toLocaleDateString()}</div>
                        </div>
                      )}
                      {result.status === 'unverified' && (
                        <div className="mt-1 text-sm text-red-700">Not found in verification records</div>
                      )}
                      {result.hash && (
                        <div className="mt-2 text-xs font-mono text-gray-500 break-all">
                          Hash: {result.hash.slice(0, 32)}...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
