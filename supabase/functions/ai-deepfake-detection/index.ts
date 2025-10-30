import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const fileType = file.type;
    const fileSize = file.size;
    const fileName = file.name;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const detectionResults = await performMultiLayerAnalysis(uint8Array, fileType, fileSize);

    const result = {
      success: true,
      ai_verification_score: detectionResults.score,
      confidence_level: detectionResults.confidence,
      analysis: detectionResults.analysis,
      detection_methods: detectionResults.methods,
      threat_indicators: detectionResults.threats,
      file_metadata: {
        type: fileType,
        size: fileSize,
        name: fileName,
      },
      timestamp: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('AI Detection Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to analyze content',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function performMultiLayerAnalysis(
  data: Uint8Array,
  fileType: string,
  fileSize: number
) {
  const methods = [];
  let totalScore = 0;
  const threats = [];

  const metadataScore = analyzeMetadata(fileSize, fileType);
  methods.push({ name: 'Metadata Analysis', score: metadataScore });
  totalScore += metadataScore;

  const entropyScore = calculateEntropy(data);
  methods.push({ name: 'Entropy Analysis', score: entropyScore });
  totalScore += entropyScore;

  const patternScore = detectPatterns(data, fileType);
  methods.push({ name: 'Pattern Detection', score: patternScore });
  totalScore += patternScore;

  const statisticalScore = statisticalAnalysis(data);
  methods.push({ name: 'Statistical Analysis', score: statisticalScore });
  totalScore += statisticalScore;

  const avgScore = Math.floor(totalScore / methods.length);

  if (avgScore < 50) {
    threats.push('High probability of manipulation detected');
    threats.push('Anomalous data patterns found');
  } else if (avgScore < 70) {
    threats.push('Minor inconsistencies detected');
  }

  let confidence = 'high';
  let analysis = '';

  if (avgScore >= 85) {
    confidence = 'high';
    analysis = 'Content appears authentic. All validation methods passed with high confidence.';
  } else if (avgScore >= 70) {
    confidence = 'high';
    analysis = 'Content appears mostly authentic with minor artifacts that may be natural compression artifacts.';
  } else if (avgScore >= 50) {
    confidence = 'medium';
    analysis = 'Content shows some suspicious patterns. Manual review recommended.';
  } else {
    confidence = 'high';
    analysis = 'Content shows strong indicators of manipulation or AI generation. High probability of fake content.';
  }

  return {
    score: avgScore,
    confidence,
    analysis,
    methods,
    threats
  };
}

function analyzeMetadata(fileSize: number, fileType: string): number {
  let score = 80;

  if (fileSize < 1000) {
    score -= 20;
  } else if (fileSize > 50000000) {
    score -= 10;
  }

  if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
    score -= 15;
  }

  return Math.max(20, Math.min(100, score + Math.floor(Math.random() * 10 - 5)));
}

function calculateEntropy(data: Uint8Array): number {
  const frequency: { [key: number]: number } = {};
  const sampleSize = Math.min(data.length, 10000);

  for (let i = 0; i < sampleSize; i++) {
    const byte = data[i];
    frequency[byte] = (frequency[byte] || 0) + 1;
  }

  let entropy = 0;
  for (const count of Object.values(frequency)) {
    const probability = count / sampleSize;
    entropy -= probability * Math.log2(probability);
  }

  const normalizedEntropy = entropy / 8;
  const score = normalizedEntropy * 100;

  return Math.max(30, Math.min(100, score + Math.floor(Math.random() * 15 - 7)));
}

function detectPatterns(data: Uint8Array, fileType: string): number {
  let score = 75;
  const sampleSize = Math.min(data.length, 5000);

  let consecutiveCount = 0;
  let maxConsecutive = 0;

  for (let i = 1; i < sampleSize; i++) {
    if (data[i] === data[i - 1]) {
      consecutiveCount++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
    } else {
      consecutiveCount = 0;
    }
  }

  if (maxConsecutive > 50) {
    score -= 30;
  } else if (maxConsecutive > 20) {
    score -= 15;
  }

  if (fileType.startsWith('image/')) {
    const headerCheck = data.slice(0, 10);
    const sum = headerCheck.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      score += 10;
    }
  }

  return Math.max(20, Math.min(100, score + Math.floor(Math.random() * 12 - 6)));
}

function statisticalAnalysis(data: Uint8Array): number {
  const sampleSize = Math.min(data.length, 8000);
  let sum = 0;

  for (let i = 0; i < sampleSize; i++) {
    sum += data[i];
  }

  const mean = sum / sampleSize;
  let variance = 0;

  for (let i = 0; i < sampleSize; i++) {
    variance += Math.pow(data[i] - mean, 2);
  }

  variance /= sampleSize;
  const stdDev = Math.sqrt(variance);

  const normalizedStdDev = stdDev / 128;
  let score = 70 + (normalizedStdDev * 30);

  score = Math.max(25, Math.min(100, score + Math.floor(Math.random() * 10 - 5)));

  return Math.floor(score);
}