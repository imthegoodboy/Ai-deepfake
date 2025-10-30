import { useState } from 'react';
import { Upload, FileText, Image, Video, Loader2, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { supabase } from '../lib/supabase';
import { generateHash, generateTextHash, generateMockTransactionHash, generateMockCID } from '../lib/crypto';

export function UploadPage() {
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const [contentType, setContentType] = useState<'image' | 'video' | 'text'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    hash: string;
    txHash: string;
    cid: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (contentType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!title.trim()) {
      alert('Please provide a title');
      return;
    }

    if (contentType === 'text' && !textContent.trim()) {
      alert('Please provide text content');
      return;
    }

    if (contentType !== 'text' && !file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    try {
      let hash: string;
      if (contentType === 'text') {
        hash = await generateTextHash(textContent);
      } else if (file) {
        hash = await generateHash(file);
      } else {
        throw new Error('No content to hash');
      }

      const txHash = generateMockTransactionHash();
      const cid = generateMockCID();

      const { error } = await supabase.from('verified_content').insert({
        content_hash: hash,
        content_type: contentType,
        filecoin_cid: cid,
        wallet_address: walletAddress,
        creator_name: creatorName || 'Anonymous',
        title: title,
        description: description,
        blockchain_tx_hash: txHash,
        verification_status: 'verified'
      });

      if (error) throw error;

      setUploadResult({ hash, txHash, cid });

      setFile(null);
      setTextContent('');
      setTitle('');
      setDescription('');
      setPreview(null);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <Upload className="w-20 h-20 mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Upload & Verify Content</h2>
          <p className="text-gray-600 mb-8">Connect your wallet to start verifying your original content on the blockchain</p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (uploadResult) {
    return (
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-bold mb-2 text-gray-900">Content Verified!</h2>
            <p className="text-gray-600">Your content has been successfully verified on the blockchain</p>
          </div>

          <div className="space-y-4 bg-gray-50 rounded-xl p-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Content Hash (SHA-256)</label>
              <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm break-all">
                {uploadResult.hash}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Polygon Transaction Hash</label>
              <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm break-all">
                {uploadResult.txHash}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Filecoin CID</label>
              <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm break-all">
                {uploadResult.cid}
              </div>
            </div>
          </div>

          <button
            onClick={() => setUploadResult(null)}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Upload Content for Verification</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Content Type</label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => { setContentType('image'); setFile(null); setPreview(null); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                contentType === 'image'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image className={`w-8 h-8 mx-auto mb-2 ${contentType === 'image' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${contentType === 'image' ? 'text-blue-600' : 'text-gray-600'}`}>Image</span>
            </button>
            <button
              onClick={() => { setContentType('video'); setFile(null); setPreview(null); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                contentType === 'video'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Video className={`w-8 h-8 mx-auto mb-2 ${contentType === 'video' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${contentType === 'video' ? 'text-blue-600' : 'text-gray-600'}`}>Video</span>
            </button>
            <button
              onClick={() => { setContentType('text'); setFile(null); setPreview(null); }}
              className={`p-4 rounded-lg border-2 transition-all ${
                contentType === 'text'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className={`w-8 h-8 mx-auto mb-2 ${contentType === 'text' ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${contentType === 'text' ? 'text-blue-600' : 'text-gray-600'}`}>Text</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Creator Name (Optional)</label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Your name or organization"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {contentType === 'text' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Text Content *</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your text content here..."
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload {contentType === 'image' ? 'Image' : 'Video'} *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept={contentType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600 mb-1">Click to upload {contentType}</p>
                      <p className="text-sm text-gray-500">{file ? file.name : 'No file selected'}</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying on Blockchain...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload & Verify
            </>
          )}
        </button>
      </div>
    </div>
  );
}
