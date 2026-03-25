import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';
import * as authService from '../services/authService';
import { GoogleProfile } from '../types';

const googleClient = new OAuth2Client(config.googleOAuth.clientId);

// GET /auth/google - Redirect to Google OAuth
export const googleAuth = (_req: Request, res: Response): void => {
  const redirectUri = config.googleOAuth.callbackUrl;
  const scope = ['openid', 'email', 'profile'].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${config.googleOAuth.clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent(scope)}&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(authUrl);
};

// GET /auth/google/callback - Handle Google OAuth callback
export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      res.redirect(`${config.frontendUrl}/login?error=no_code`);
      return;
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: config.googleOAuth.clientId,
        client_secret: config.googleOAuth.clientSecret,
        redirect_uri: config.googleOAuth.callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json() as { id_token?: string };

    if (!tokenData.id_token) {
      res.redirect(`${config.frontendUrl}/login?error=token_exchange_failed`);
      return;
    }

    // Verify ID token and get user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenData.id_token,
      audience: config.googleOAuth.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      res.redirect(`${config.frontendUrl}/login?error=invalid_token`);
      return;
    }

    const profile: GoogleProfile = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };

    // Create or update user
    const user = authService.upsertFromGoogle(profile);

    if (user.isBlocked) {
      res.redirect(`${config.frontendUrl}/login?error=account_blocked`);
      return;
    }

    // Generate JWT token
    const tokens = authService.generateTokens(user);

    // Redirect to frontend with token
    res.redirect(`${config.frontendUrl}/auth/callback?token=${tokens.accessToken}&expiresIn=${tokens.expiresIn}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }
};

// GET /auth/me - Get current user info
export const getCurrentUser = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      profileImage: req.user.profileImage,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

// POST /auth/logout - Logout (client should delete token)
export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
};
