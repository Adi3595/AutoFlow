import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const resolvedParams = await params;
  const provider = resolvedParams.provider.toLowerCase();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  let accessToken = '';

  try {
    if (provider === 'github') {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error_description || data.error);
      accessToken = data.access_token;
      
    } else if (provider === 'slack') {
      const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
      const clientSecret = process.env.SLACK_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const redirectUri = `${baseUrl}/api/auth/callback/slack`;
      
      const res = await fetch('https://slack.com/api/oauth.v2.access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId || '',
          client_secret: clientSecret || '',
          code,
          redirect_uri: redirectUri
        })
      });
      
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      // Slack provides authed_user.access_token for user scopes
      accessToken = data.authed_user?.access_token || data.access_token;
      
    } else if (provider === 'notion') {
      const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID;
      const clientSecret = process.env.NOTION_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const redirectUri = `${baseUrl}/api/auth/callback/notion`;
      
      const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      
      const res = await fetch('https://api.notion.com/v1/oauth/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      accessToken = data.access_token;
      
    } else if (provider === 'gmail') {
      const clientId = process.env.NEXT_PUBLIC_GMAIL_CLIENT_ID;
      const clientSecret = process.env.GMAIL_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const redirectUri = `${baseUrl}/api/auth/callback/gmail`;
      
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error_description || data.error);
      accessToken = data.access_token;
      
    } else if (provider === 'jira') {
      const clientId = process.env.NEXT_PUBLIC_JIRA_CLIENT_ID;
      const clientSecret = process.env.JIRA_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const redirectUri = `${baseUrl}/api/auth/callback/jira`;
      
      const res = await fetch('https://auth.atlassian.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error_description || data.error);
      accessToken = data.access_token;
      
    } else if (provider === 'salesforce') {
      const clientId = process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID;
      const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const redirectUri = `${baseUrl}/api/auth/callback/salesforce`;
      
      const res = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId || '',
          client_secret: clientSecret || '',
          code,
          redirect_uri: redirectUri
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error_description || data.error);
      accessToken = data.access_token;
      
    } else {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    // Return HTML that passes the token to the parent window (if popup) and closes itself,
    // or saves it to localStorage and redirects if it's a direct navigation.
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: monospace; background: #000; color: #0f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          </style>
        </head>
        <body>
          <div>Authentication successful! Processing...</div>
          <script>
            const token = '${accessToken}';
            const provider = '${provider}';
            
            // Save to localStorage directly just in case
            localStorage.setItem('autoflow_token_' + provider, token);
            
            if (window.opener) {
              window.opener.postMessage(
                { type: 'OAUTH_CALLBACK', provider: provider, token: token },
                '*'
              );
              setTimeout(() => { window.close(); }, 500);
            } else {
              window.location.href = '/integrations';
            }
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to exchange token', details: err.message }, { status: 500 });
  }
}
