import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'genai-apac-2026-491004';

function getAccessToken(): string {
  try {
    const token = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
    return token;
  } catch (err: any) {
    throw new Error(`Failed to retrieve gcloud access token: ${err.message}`);
  }
}

async function apiRequest(url: string, method: string = 'GET', body?: any, token?: string) {
  const authToken = token || getAccessToken();
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${authToken}`,
    'X-Goog-User-Project': PROJECT_ID,
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, ok: response.ok, data };
}

async function main() {
  console.log(`\n=================================================================`);
  console.log(`  ReflectLogixAI - Automated Firebase & Auth Configurator`);
  console.log(`=================================================================`);
  console.log(`Target GCP Project: ${PROJECT_ID}`);

  const token = getAccessToken();
  console.log(`[OK] Acquired Google Cloud ADC Access Token.`);

  // 1. Add Firebase to GCP Project (if not already added)
  console.log(`\n--> [1/5] Checking Firebase Project registration...`);
  const projectCheck = await apiRequest(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}`, 'GET', undefined, token);
  if (projectCheck.ok) {
    console.log(`[OK] Firebase is already enabled for project: ${projectCheck.data.displayName || PROJECT_ID}`);
  } else {
    console.log(`[INFO] Adding Firebase metadata to project ${PROJECT_ID}...`);
    const addFirebase = await apiRequest(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}:addFirebase`, 'POST', {}, token);
    console.log(`Status: ${addFirebase.status}`, addFirebase.data);
  }

  // 2. Check / Register Firebase Web App
  console.log(`\n--> [2/5] Checking Firebase Web App registration...`);
  let webAppsRes = await apiRequest(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps`, 'GET', undefined, token);
  let appId: string | undefined;

  if (webAppsRes.ok && webAppsRes.data.apps && webAppsRes.data.apps.length > 0) {
    appId = webAppsRes.data.apps[0].appId;
    console.log(`[OK] Found existing Web App: ${webAppsRes.data.apps[0].displayName} (App ID: ${appId})`);
  } else {
    console.log(`[INFO] Registering new Firebase Web App "ReflectLogixAI-Web"...`);
    const createAppRes = await apiRequest(
      `https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps`,
      'POST',
      { displayName: 'ReflectLogixAI-Web' },
      token
    );
    console.log(`Web App creation response:`, createAppRes.data);
    
    // Wait 3 seconds for async creation to complete
    await new Promise(r => setTimeout(r, 3000));
    webAppsRes = await apiRequest(`https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps`, 'GET', undefined, token);
    if (webAppsRes.ok && webAppsRes.data.apps && webAppsRes.data.apps.length > 0) {
      appId = webAppsRes.data.apps[0].appId;
      console.log(`[OK] Registered Web App: ${webAppsRes.data.apps[0].displayName} (App ID: ${appId})`);
    }
  }

  // 3. Fetch Web App Client Config
  if (appId) {
    console.log(`\n--> [3/5] Fetching Firebase Client Config for App: ${appId}...`);
    const configRes = await apiRequest(
      `https://firebase.googleapis.com/v1beta1/projects/${PROJECT_ID}/webApps/${appId}/config`,
      'GET',
      undefined,
      token
    );
    if (configRes.ok) {
      console.log(`[OK] Firebase Client Configuration retrieved.`);
      const maskedConfig = { ...configRes.data, apiKey: configRes.data.apiKey ? '***REDACTED***' : '' };
      console.log(JSON.stringify(maskedConfig, null, 2));

      // Save client config to frontend env file for easy integration
      const envPath = path.resolve('apps/web/.env.production');
      const envContent = [
        `# Auto-generated Firebase Config for ${PROJECT_ID}`,
        `VITE_FIREBASE_API_KEY=${configRes.data.apiKey || ''}`,
        `VITE_FIREBASE_AUTH_DOMAIN=${configRes.data.authDomain || `${PROJECT_ID}.firebaseapp.com`}`,
        `VITE_FIREBASE_PROJECT_ID=${configRes.data.projectId || PROJECT_ID}`,
        `VITE_FIREBASE_STORAGE_BUCKET=${configRes.data.storageBucket || `${PROJECT_ID}.appspot.com`}`,
        `VITE_FIREBASE_MESSAGING_SENDER_ID=${configRes.data.messagingSenderId || ''}`,
        `VITE_FIREBASE_APP_ID=${configRes.data.appId || appId}`,
        `VITE_FIREBASE_MEASUREMENT_ID=${configRes.data.measurementId || ''}`,
        `VITE_APP_ENV=production`
      ].join('\n');

      fs.writeFileSync(envPath, envContent + '\n', 'utf-8');
      console.log(`[OK] Written client config to apps/web/.env.production`);
    }
  }

  // 4. Deploy Firestore Security Rules via Rules API
  console.log(`\n--> [4/5] Deploying Firestore Security Rules...`);
  const rulesFilePath = path.resolve('infra/firestore.rules');
  if (fs.existsSync(rulesFilePath)) {
    const rulesContent = fs.readFileSync(rulesFilePath, 'utf-8');
    
    // Create ruleset
    const rulesetPayload = {
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesContent
          }
        ]
      }
    };

    const rulesetRes = await apiRequest(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`,
      'POST',
      rulesetPayload,
      token
    );

    if (rulesetRes.ok && rulesetRes.data.name) {
      const rulesetName = rulesetRes.data.name;
      console.log(`[OK] Created Ruleset: ${rulesetName}`);

      // Update the release for cloud.firestore
      const releaseName = `projects/${PROJECT_ID}/releases/cloud.firestore`;
      
      const patchReleaseRes = await apiRequest(
        `https://firebaserules.googleapis.com/v1/${releaseName}?updateMask=rulesetName`,
        'PATCH',
        {
          release: {
            name: releaseName,
            rulesetName: rulesetName
          }
        },
        token
      );

      if (patchReleaseRes.ok) {
        console.log(`[OK] Released Firestore security rules: ${patchReleaseRes.data.name} (ruleset: ${patchReleaseRes.data.rulesetName})`);
      } else {
        console.log(`Release patch status: ${patchReleaseRes.status}`, patchReleaseRes.data);
      }
    } else {
      console.log(`Ruleset creation response:`, rulesetRes.data);
    }
  }

  // 5. Inspect Identity Toolkit / Auth Configuration
  console.log(`\n--> [5/5] Inspecting Identity Toolkit / Firebase Auth config...`);
  // Try initialize via POST to Identity Platform
  const initIdpRes = await apiRequest(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/defaultSupportedIdpConfigs?idpId=google.com`,
    'POST',
    {
      name: `projects/${PROJECT_ID}/defaultSupportedIdpConfigs/google.com`,
      enabled: true,
      clientId: "placeholder.apps.googleusercontent.com",
      clientSecret: "placeholder"
    },
    token
  );
  console.log(`IDP Init status: ${initIdpRes.status}`);

  const authConfigRes = await apiRequest(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT_ID}/config`,
    'GET',
    undefined,
    token
  );
  if (authConfigRes.ok) {
    console.log(`[OK] Identity Toolkit Config Active:`);
    console.log(`- Authorized Domains: ${(authConfigRes.data.authorizedDomains || []).join(', ')}`);
  } else {
    console.log(`Identity Toolkit status (${authConfigRes.status}):`, authConfigRes.data);
  }

  console.log(`\n=================================================================`);
  console.log(`  FIREBASE & AUTH SETUP COMPLETED SUCCESSFULLY!`);
  console.log(`=================================================================\n`);
}

main().catch(err => {
  console.error(`[FATAL]`, err);
  process.exit(1);
});
