import { AuthUser } from '../types/user';
import { SupabaseAuthUser } from '../types/user';
import { Profile } from '../../profile/types';

export const mapUserFromProfile = (
  profile: Profile,
  authUser: SupabaseAuthUser
): AuthUser => ({
  id: profile.id,
  name: profile.full_name,
  email: profile.email,
  username: profile.username,
  is_admin: profile.is_admin || false,
  email_verified: authUser.email_verified || false
});