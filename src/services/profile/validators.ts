import { ProfileInsert } from './types';
import { PROFILE_ERRORS, PROFILE_CONSTRAINTS } from './constants';
import { isValidUsername, isValidName } from './utils';

export const validateProfileData = (profile: ProfileInsert): string[] => {
  const errors: string[] = [];

  if (!profile.id) {
    errors.push(PROFILE_ERRORS.MISSING_ID);
  }

  if (!profile.email) {
    errors.push(PROFILE_ERRORS.MISSING_EMAIL);
  }

  if (!profile.username) {
    errors.push(PROFILE_ERRORS.MISSING_USERNAME);
  } else if (!isValidUsername(profile.username)) {
    errors.push(`Username must be ${PROFILE_CONSTRAINTS.USERNAME_MIN_LENGTH}-${PROFILE_CONSTRAINTS.USERNAME_MAX_LENGTH} characters and contain only letters, numbers, underscores, and hyphens`);
  }

  if (!profile.full_name) {
    errors.push(PROFILE_ERRORS.MISSING_NAME);
  } else if (!isValidName(profile.full_name)) {
    errors.push(`Name must be ${PROFILE_CONSTRAINTS.NAME_MIN_LENGTH}-${PROFILE_CONSTRAINTS.NAME_MAX_LENGTH} characters and contain only letters, spaces, hyphens, and apostrophes`);
  }

  return errors;
};