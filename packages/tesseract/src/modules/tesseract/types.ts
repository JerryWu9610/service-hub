export type RecognizeAlphanumericParams = {
  data: string;
  params?: Record<string, any>;
};

export type RecognizeResult = {
  text: string;
  version: string;
  psm: string;
  oem: string;
  confidence: number;
};
