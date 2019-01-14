import * as orgUnit from './orgUnit'
import * as user from './user'
import * as userOrgUnit from './userOrgUnit'
import * as workflow from './workflow'
import * as stage from './stage'
import * as stageTransition from './stageTransition'

export const settings = {
  org_unit: orgUnit.settings,
  user: user.settings,
  user_org_unit: userOrgUnit.settings,
  workflow: workflow.settings,
  stage: stage.settings,
  stage_transition: stageTransition.settings
}

export const fragments = {
  org_unit: orgUnit.fragments,
  user: user.fragments,
  user_org_unit: userOrgUnit.fragments,
  workflow: workflow.fragments,
  stage: stage.fragments,
  stage_transition: stageTransition.fragments
}

export const queries = {
  org_unit: orgUnit.queries,
  user: user.queries,
  user_org_unit: userOrgUnit.queries,
  workflow: workflow.queries,
  stage: stage.queries,
  stage_transition: stageTransition.queries
}

export const mutations = {
  org_unit: orgUnit.mutations,
  user: user.mutations,
  user_org_unit: userOrgUnit.mutations,
  workflow: workflow.mutations,
  stage: stage.mutations,
  stage_transition: stageTransition.mutations
}
