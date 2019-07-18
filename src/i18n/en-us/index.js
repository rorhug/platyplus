// This is just an example,
// so you can safely delete all default props below

export default {
  yes: 'Yes',
  no: 'No',
  ok: 'OK',
  cancel: 'Cancel',
  reset: 'Reset',
  edit: 'Edit',
  create: 'Create',
  remove: 'Remove',
  select: 'Select',
  location: {
    message: 'You are in {location}.',
    select: 'Select your location:',
    change: 'Change location'
  },
  language: 'Language',
  logout: {
    message: 'Are you sure to want to sign out?'
  },
  user: {
    labels: {
      username: 'User name',
      password: 'Password',
      created_at: 'Member since',
      roles: 'Global roles',
      membership: 'Membership',
      preferred_org_unit: 'Preferred location',
      attributes: {
        first_name: 'First name',
        last_name: 'Last name'
      }
    },
    helpers: {
      username: 'Enter your user name',
      password: 'Enter your password',
      roles: 'Select the global roles',
      membership: 'Pick org units',
      preferred_org_unit: 'Pick an org unit'
    },
    errors: {
      username: 'User name is required',
      password: 'Password is required',
      roles: '',
      membership: ''
    },
    profile: {
      title: 'Profile'
    }
  }
}
