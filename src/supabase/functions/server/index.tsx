import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4fc01492/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth endpoints
app.post("/make-server-4fc01492/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Check if user already exists first
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email === email);
    
    if (userExists) {
      return c.json({ 
        error: 'An account with this email already exists. Please sign in instead.',
        code: 'user_exists'
      }, 409);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error codes
      if (error.message.includes('already been registered')) {
        return c.json({ 
          error: 'An account with this email already exists. Please sign in instead.',
          code: 'user_exists'
        }, 409);
      }
      
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});

// API Keys endpoints
app.get("/make-server-4fc01492/api-keys", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Auth error while fetching API keys:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user's API keys from KV store
    const keys = await kv.get(`apikeys:${user.id}`);
    
    // Return empty keys object if none exist
    const defaultKeys = {
      platform: '',
      apiKey: '',
      apiSecret: '',
      authToken: '',
    };
    
    return c.json({ keys: keys || defaultKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return c.json({ error: 'Failed to fetch API keys' }, 500);
  }
});

app.put("/make-server-4fc01492/api-keys", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('Auth error while updating API keys:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const keys = await c.req.json();
    
    const apiKeys = {
      platform: keys.platform || '',
      apiKey: keys.apiKey || '',
      apiSecret: keys.apiSecret || '',
      authToken: keys.authToken || '',
      updatedAt: new Date().toISOString(),
      userId: user.id,
    };

    await kv.set(`apikeys:${user.id}`, apiKeys);
    
    return c.json({ keys: apiKeys, success: true });
  } catch (error) {
    console.error('Error updating API keys:', error);
    return c.json({ error: 'Failed to update API keys' }, 500);
  }
});

Deno.serve(app.fetch);