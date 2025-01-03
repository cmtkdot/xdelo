import { supabase } from "@/integrations/supabase/client";
import { AISettings } from "./AISettings";

interface SqlQueryResult {
  data: any[];
  query: string;
  timestamp: string;
}

interface SqlErrorResult {
  error: string;
  detail: string;
  query: string;
}

type QueryResponse = SqlQueryResult | SqlErrorResult;

export const handleAIResponse = async (
  message: string,
  settings: AISettings,
  user_id: string,
  messageId: number
) => {
  // First try to detect if this is a SQL query
  const isSqlQuery = message.toLowerCase().trim().startsWith('select') || 
                    message.toLowerCase().includes('from') ||
                    message.toLowerCase().includes('where');

  if (isSqlQuery) {
    const { data: queryResult, error: queryError } = await supabase.rpc('execute_safe_query', {
      query_text: message
    });

    if (queryError) throw queryError;

    // Type guard to check if we have an error response
    const isErrorResponse = (response: any): response is SqlErrorResult => {
      return 'error' in response;
    };

    if (isErrorResponse(queryResult)) {
      throw new Error(queryResult.error);
    }

    // Cast the response to SqlQueryResult after validating its structure
    const sqlResult = queryResult as unknown as SqlQueryResult;
    if (!sqlResult.data || !sqlResult.query || !sqlResult.timestamp) {
      throw new Error('Invalid SQL query response structure');
    }

    const response = {
      type: 'sql',
      query: message,
      result: sqlResult.data
    };

    await saveBotResponse(response, user_id, messageId);
    return response;
  } 

  // Handle NLP/Chat response
  const { data, error } = await supabase.functions.invoke("process-message", {
    body: { 
      message,
      settings: {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        streamResponse: settings.streamResponse
      }
    },
  });

  if (error) throw error;

  await saveBotResponse(data, user_id, messageId);
  return data;
};

const saveBotResponse = async (
  response: any,
  user_id: string,
  messageId: number
) => {
  const botResponse = typeof response === 'string' ? response : 
    response.type === 'sql' ? 
      `I executed the following SQL query:\n\`\`\`sql\n${response.query}\n\`\`\`\n\nResults:\n\`\`\`json\n${JSON.stringify(response.result, null, 2)}\n\`\`\`` :
      response.response;

  const { error: botMessageError } = await supabase.from("messages").insert({
    user_id,
    sender_name: "Bot",
    text: botResponse,
    message_id: messageId + 1,
    metadata: response.type === 'sql' ? { type: 'sql', query: response.query, result: response.result } : undefined
  });

  if (botMessageError) throw botMessageError;
};