// Vercel Serverless Function - AI API 代理
// 解决浏览器端直接调用 AI API 的 CORS 问题

export default async function handler(req: any, res: any) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { apiKey, baseUrl, model, messages, temperature, maxTokens } = req.body;

    if (!apiKey || !baseUrl) {
      return res.status(400).json({ error: 'Missing apiKey or baseUrl' });
    }

    // 构建请求 URL
    const apiUrl = `${baseUrl}/chat/completions`;

    // 转发请求到 AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'qwen3.5-plus',
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}