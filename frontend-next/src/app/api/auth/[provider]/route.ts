import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider.toLowerCase();
  
  // Use VERCEL_URL if available, otherwise fallback to localhost for local testing
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  if (provider === 'github') {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/github`;
    
    if (!clientId) {
      return NextResponse.json({ error: 'GitHub Client ID not configured. Please add NEXT_PUBLIC_GITHUB_CLIENT_ID to your .env' }, { status: 500 });
    }
    
    // GitHub OAuth URL
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;
    
    return NextResponse.redirect(authUrl);
  }
  
  if (provider === 'slack') {
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/slack`;
    
    if (!clientId) {
      return NextResponse.json({ error: 'Slack Client ID not configured. Please add NEXT_PUBLIC_SLACK_CLIENT_ID to your .env' }, { status: 500 });
    }
    
    // Slack OAuth URL (v2)
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&user_scope=chat:write,channels:read`;
    
    return NextResponse.redirect(authUrl);
  }
  
  return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
}
