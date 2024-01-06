export const createMockRequest = (url: string) => {
  const mockEnv = {
    BOT_TOKEN: "BOT_TOKEN",
    SUPABASE_KEY: "SUPABASE_KEY",
    SUPABASE_URL: "SUPABASE_URL",
    VITE_BOT_APP_URL: "VITE_BOT_APP_URL",
  };

  return {
    request: { url: url },
    env: mockEnv,
  } as any;
};
