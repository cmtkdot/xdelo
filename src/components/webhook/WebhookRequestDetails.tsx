import { Info } from "lucide-react";
import { HttpMethod } from "./WebhookMethodSelector";
import { Header } from "./WebhookHeaderManager";
import { QueryParam } from "./WebhookQueryManager";

interface WebhookRequestDetailsProps {
  method: HttpMethod;
  selectedMedia: any[];
  selectedFields: string[];
  headers: Header[];
  params: QueryParam[];
  body: string;
}

const WebhookRequestDetails = ({ 
  method, 
  selectedMedia, 
  selectedFields,
  headers,
  params,
  body
}: WebhookRequestDetailsProps) => {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="flex items-start space-x-2">
        <Info className="w-5 h-5 text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-white">Request Details</h4>
          <p className="text-xs text-white/70">
            Method: {method}
          </p>
          <p className="text-xs text-white/70">
            Headers: {headers.map(h => `${h.key}: ${h.value}`).join(', ')}
          </p>
          <p className="text-xs text-white/70">
            Query Parameters: {params.map(p => `${p.key}=${p.value}`).join('&')}
          </p>
          {method !== "GET" && (
            <>
              <p className="text-xs text-white/70">
                Selected Fields: {selectedFields.join(', ')}
              </p>
              <p className="text-xs text-white/70">
                Selected Media Count: {selectedMedia.length}
              </p>
              {body && (
                <div className="mt-2">
                  <p className="text-xs text-white/70 mb-1">Request Body:</p>
                  <pre className="text-xs bg-black/40 p-2 rounded overflow-x-auto">
                    {body}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookRequestDetails;