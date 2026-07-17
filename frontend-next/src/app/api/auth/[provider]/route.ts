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
  if (provider === 'notion') {
    const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/notion`;
    if (!clientId) return NextResponse.json({ error: 'Notion Client ID not configured.' }, { status: 500 });
    const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === 'gmail') {
    const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/gmail`;
    if (!clientId) return NextResponse.json({ error: 'Gmail Client ID not configured.' }, { status: 500 });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/gmail.send%20https://www.googleapis.com/auth/gmail.readonly&access_type=offline`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === 'jira') {
    const clientId = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/jira`;
    if (!clientId) return NextResponse.json({ error: 'Jira Client ID not configured.' }, { status: 500 });
    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=read:jira-user%20read:jira-work%20write:jira-work&redirect_uri=${encodeURIComponent(redirectUri)}&state=local&response_type=code&prompt=consent`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === 'salesforce') {
    const clientId = process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID;
    const redirectUri = `${baseUrl}/api/auth/callback/salesforce`;
    if (!clientId) return NextResponse.json({ error: 'Salesforce Client ID not configured.' }, { status: 500 });
    const authUrl = `https://login.salesforce.com/services/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
    return NextResponse.redirect(authUrl);
  }
  return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
}
