🧠 TrustLens
Verify the Truth in a World Full of Fakes — Powered by AI, Polygon & Filecoin
🚀 Overview

TrustLens is a decentralized platform that helps people verify the authenticity of digital content — such as images, videos, and news posts — using AI and blockchain technology.

It allows creators and journalists to timestamp and register their original content on the Polygon blockchain, while storing the actual media safely on Filecoin (a decentralized storage network).
When anyone wants to check if a photo or video is real or fake, they can simply upload or paste it into TrustLens — and the system will verify it in seconds.

💡 Why TrustLens

In today’s world, it’s hard to know what’s real — fake news, AI-generated images, and deepfake videos are spreading fast.
TrustLens gives everyone a transparent and verifiable way to confirm whether content is authentic, protecting creators, journalists, and the public from misinformation.

🧩 How It Works (Simple Explanation)

Upload or Register Content
A creator uploads an image, video, or text file.

The system generates a unique digital fingerprint (hash) of the content.

The hash is stored on the Polygon blockchain, along with the creator’s wallet address and timestamp.

The actual media file is stored on Filecoin, a decentralized storage network.

Verification Process
Anyone can later upload or paste a link to check if a piece of content is authentic.

The system re-generates the hash and compares it with records on the blockchain.

If the hash matches → ✅ Verified Original

If not → ⚠️ Possible Fake or Altered

AI Deepfake Detection (optional feature)
If a video or image seems suspicious, TrustLens runs it through a deepfake detection model built with Python and machine learning (CNN/OpenCV).
The AI then shows how “real” or “fake” the content appears.

🧱 Tech Stack
Layer	Technology	Purpose
Frontend	Next.js + TailwindCSS + Wagmi	User Interface + Wallet Connection
Backend	Node.js + Express	API + Blockchain + Filecoin Handling
Smart Contract	Solidity (Polygon Mumbai)	Stores hash, wallet, and timestamp
AI Model	Python (Flask + CNN)	Deepfake detection & analysis
Storage	Filecoin via Web3.Storage	Decentralized content storage
⚙️ Features

✅ Wallet Login: Connect MetaMask or WalletConnect.
✅ Upload & Verify: Upload your content and verify its originality.
✅ Blockchain Timestamp: Immutable proof of when and by whom it was created.
✅ AI Detection: Detect fake or AI-altered media using machine learning.
✅ Decentralized Storage: All files safely stored on Filecoin, not centralized servers.
✅ Verification Dashboard: View verified content and timestamps in real-time.



🧠 Example Use Case

A journalist uploads an original photo of an event.

TrustLens stores its hash on Polygon and the file on Filecoin.

Later, someone sees the same photo circulating online and wants to check if it’s real.

They upload it to TrustLens → the system compares the hash → returns:
✅ “Verified Original by @journalist.eth — March 2025


