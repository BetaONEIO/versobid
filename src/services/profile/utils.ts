import { Profile } from './types';
import { PROFILE_CONSTRAINTS } from './constants';

export const isValidUsername = (username: string): boolean => {
  if (!username) return false;
  if (username.length < PROFILE_CONSTRAINTS.USERNAME_MIN_LENGTH) return false;
  if (username.length > PROFILE_CONSTRAINTS.USERNAME_MAX_LENGTH) return false;
  return /^[a-zA-Z0-9_-]+$/.test(username);
};

export const isValidName = (name: string): boolean => {
  if (!name) return false;
  if (name.length < PROFILE_CONSTRAINTS.NAME_MIN_LENGTH) return false;
  if (name.length > PROFILE_CONSTRAINTS.NAME_MAX_LENGTH) return false;
  return /^[a-zA-Z\s'-]+$/.test(name);
};

export const sanitizeProfile = (profile: Partial<Profile>): Partial<Profile> => {
  return {
    ...profile,
    username: profile.username?.trim().toLowerCase(),
    full_name: profile.full_name?.trim(),
    email: profile.email?.trim().toLowerCase()
  };
};