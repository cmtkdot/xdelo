export const detectIntent = async (message: string, settings: any, trainingContext: string, openaiApiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that categorizes user queries into either "sql" or "webhook" actions. 
          Here is some context about the system and examples:
          ${trainingContext}
          Respond with ONLY "sql" or "webhook" based on whether the user is trying to query data or trigger a webhook action.`
        },
        { role: 'user', content: message }
      ],
      temperature: settings?.temperature ?? 0.7,
      max_tokens: settings?.maxTokens ?? 500,
    }),
  });

  const data = await response.json();
  const intent = data.choices[0].message.content.toLowerCase().trim();
  console.log('Detected intent:', intent);
  return intent;
};

export const generateSqlQuery = async (message: string, settings: any, trainingContext: string, openaiApiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a SQL expert. Convert natural language queries into PostgreSQL queries.
          Available tables: media, messages, channels, webhook_urls, webhook_history, ai_training_data.
          Here are some SQL examples and documentation:
          ${trainingContext}
          Return ONLY the raw SQL query without any formatting, quotes, or markdown.`
        },
        { role: 'user', content: message }
      ],
      temperature: settings?.temperature ?? 0.7,
      max_tokens: settings?.maxTokens ?? 500,
    }),
  });

  const data = await response.json();
  const query = data.choices[0].message.content.trim();
  console.log('Generated SQL query:', query);
  return query;
};

export const generateWebhookAction = async (message: string, settings: any, trainingContext: string, webhookUrls: any, openaiApiKey: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a webhook expert. Convert natural language into webhook actions.
          Available webhooks: ${JSON.stringify(webhookUrls)}.
          Here is some context about webhooks and examples:
          ${trainingContext}
          Return a raw JSON object with webhookId and data properties. Do not use markdown, code blocks, or any formatting.
          Example format: {"webhookId": "123", "data": {"key": "value"}}`
        },
        { role: 'user', content: message }
      ],
      temperature: settings?.temperature ?? 0.7,
      max_tokens: settings?.maxTokens ?? 500,
    }),
  });

  const data = await response.json();
  const actionText = data.choices[0].message.content.trim();
  console.log('Generated webhook action:', actionText);
  
  try {
    // Try to parse the response as JSON directly
    return JSON.parse(actionText);
  } catch (error) {
    console.error('Error parsing webhook action:', error);
    console.log('Raw action text:', actionText);
    throw new Error('Invalid webhook action format returned from AI. Please try again with a clearer request.');
  }
};