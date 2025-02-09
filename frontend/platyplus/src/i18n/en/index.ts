/*eslint-disable @typescript-eslint/camelcase */
export default {
  yes: 'Yes',
  no: 'No',
  ok: 'OK',
  cancel: 'Cancel',
  save: 'Save',
  previous: 'Previous',
  next: 'Next',
  reset: 'Reset',
  edit: 'Edit',
  create: 'Create',
  remove: 'Remove',
  select: 'Select',
  delete: {
    title: 'Confirmation',
    label: 'Are you sure to delete the {tableLabel} "{label}"?'
  },
  index: {
    title: 'Home'
  },
  location: {
    message: 'You are in {location}.',
    select: 'Select your location:',
    change: 'Change location'
  },
  language: 'Language',
  logout: {
    message: 'Are you sure to want to sign out?'
  },
  encounter_type: {
    label_plural: 'Encounter types',
    labels: {
      name: 'Name',
      title_create: 'Creation label',
      encounter_title: 'Encounter title',
      isolated_uses: 'Isolated uses',
      entity_type: '@:entity_type.label',
      encounter_schema: 'Schema'
    },
    /*eslint-enable camelcase */
    helpers: {
      name: 'Name fo the encounter type',
      title_create: 'Label used for creating an encounter',
      encounter_title: 'Template used to generate each encounter title',
      isolated_uses:
        'Org units using this encounter type outside of a workflow',
      entity_type: 'Type of the entity with which the encounter type works'
    },
    errors: {
      name: 'Invalid name',
      title_create: 'Invalid label',
      encounter_title: 'Invalid encounter title',
      isolated_uses: 'Invalid list of isolated used',
      entity_type: 'Invalid entity type'
    },
    actions: {
      create: 'Create a new encounter type'
    }
  },
  entity_type: {
    label: 'Entity type',
    labels: {
      name: 'Name',
      encounter_types: '@:encounter_type.label_plural'
    },
    helpers: {
      name: 'Name of the entity type'
    },
    errors: {
      name: 'Invalid name'
    },
    actions: {
      encounter_types: {
        create: '@:encounter_type.actions.create'
      }
    }
  },
  org_unit: {
    label: 'Org Unit',
    label_plural: 'Org Units',
    labels: {
      name: 'Name',
      parent: 'Parent',
      children: 'Children',
      type: '@:org_unit_type.label',
      org_unit_memberships: 'Memberships',
      isolated_encounter_types: 'Isolated encounter types',
      role_attributions: '@:role_attribution.label_plural',
      workflows: 'Available @:workflow.label_plural'
    },
    helper: 'Choose an org unit',
    helpers: {
      children: 'Select the children of the org unit',
      isolated_encounter_types: '',
      name: 'Enter the name of the org unit',
      org_unit_memberships: 'Select the members of the org units',
      type: 'Select the type of the org unit',
      parent:
        "Select the org unit's parent. Choose none if this is a root org unit",
      role_attributions: 'Select the role attributions',
      workflows:
        'Select the available @:workflow.label_plural for this org unit'
    },
    error: 'Invalid org unit',
    errors: {
      children: 'Invalid selection of children',
      name: 'Invalid name',
      isolated_encounter_types: '',
      org_unit_memberships: 'Invalid selection of users',
      type: 'Invalid type',
      parent: 'Invalid parent',
      role_attributions: 'Invalid selection of role attributions',
      workflows: 'Invalid workflows selection'
    },
    actions: {
      children: {
        create: 'Create a new child org unit'
      },
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    }
  },
  org_unit_type: {
    label: 'Type',
    label_plural: 'Types',
    labels: {
      name: 'Name',
      from: 'Possible parents',
      to: 'Possible children'
    },
    helpers: {
      name: 'Enter the name of the Org Unit Type',
      from:
        'Select the possible types of parents this type can get. No parents means a root type.',
      to: 'Select the possible types of children this type can get'
    },
    errors: {
      name: 'Invalid name',
      from: 'Invalid list of parents',
      to: 'Invalid list of children'
    }
  },
  role: {
    label: 'Role',
    label_plural: 'Roles',
    labels: {
      name: 'Name',
      global: 'Global role',
      permissions: 'Permissions',
      role_attributions: '@:role_attribution.label_plural'
    },
    helper: 'Choose a role',
    helpers: {
      name: 'Enter the name of the role'
    },
    error: 'Invalid role',
    errors: {
      name: 'Invalid name'
    },
    actions: {
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    }
  },
  role_attribution: {
    label_plural: 'Role attributions',
    labels: {
      user: '@:user.label',
      role: '@:role.label',
      org_unit: '@:org_unit.label'
    },
    helpers: {
      user: '@:user.helper',
      role: '@:role.helper',
      org_unit: '@:org_unit.helper'
    },
    errors: {
      user: '@:user.error',
      role: '@:role.error',
      org_unit: '@:org_unit.error'
    },
    actions: {
      create: 'Create a new role attribution'
    }
  },
  stage: {
    label_plural: 'Stages',
    labels: {
      name: 'Name',
      previous: 'Previous stages',
      next: 'Next stages'
    },
    helpers: {
      name: 'Name of the stage',
      previous: 'Possible previous stages',
      next: 'Possible next stages'
    },
    errors: {
      name: 'Invalid name',
      previous: 'Invalid previous stages',
      next: 'Invalid next stages'
    },
    actions: {
      create: 'Create a new stage'
    }
  },
  user: {
    label: 'User',
    labels: {
      username: 'User name',
      password: 'Password',
      created_at: 'Member since',
      roles: 'Global roles',
      membership: 'Membership',
      preferred_org_unit: 'Preferred location',
      first_name: 'First name',
      last_name: 'Last name',
      language: '@:language',
      role_attributions: '@:role_attribution.label_plural'
    },
    helper: 'Choose a user',
    helpers: {
      username: 'Enter your user name',
      password: 'Enter your password',
      roles: 'Select the global roles',
      membership: 'Pick org units',
      language: 'Pick a language',
      preferred_org_unit: 'Pick an org unit',
      first_name: 'Enter a first name',
      last_name: 'Enter a last name'
    },
    error: 'Invalid user',
    errors: {
      username: 'User name is required',
      password: 'Password is required',
      first_name: 'Invalid first name',
      last_name: 'Invalid last name',
      language: 'You must select a language',
      preferred_org_unit: 'You must select a preferred org uni'
    },
    actions: {
      role_attributions: {
        create: '@:role_attribution.actions.create'
      }
    },
    profile: {
      title: 'Profile'
    }
  },
  workflow: {
    label: 'Workflow',
    label_plural: 'Workflows',
    labels: {
      name: 'Name',
      stages: '@:stage.label_plural',
      org_units: '@:org_unit.label_plural'
    },
    helpers: {
      name: 'Name of the workflow',
      org_units: 'Org Units using the workflow'
    },
    errors: {
      name: 'Invalid name',
      org_units: 'Invalid org units'
    },
    actions: {
      stages: {
        create: '@:stage.actions.create'
      }
    }
  }
}
