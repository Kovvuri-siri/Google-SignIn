import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';

export function configurePassport() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select('-passwordHash -resetToken -resetTokenExpiry');
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName || 'Google User',
            passwordHash: '',
            provider: 'google',
            googleId: profile.id
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}