export interface AiDiagramRequest {
  prompt: string;
  domain: 'cloud_architecture' | 'microservices' | 'security_auth' | 'ai_rag_pipeline' | 'data_pipeline' | 'agile_retro';
  style: 'enterprise_dark' | 'glass_cyber' | 'minimal_clean' | 'blueprint';
  includeConnectors: boolean;
  nodeCount: 'compact' | 'standard' | 'detailed';
}
