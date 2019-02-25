import gql from 'graphql-tag'
import * as encounterType from '../config/encounterType'
import * as orgUnit from '../config/orgUnit'
import * as entity from './entity'
import * as encounter from './encounter'
// TODO: check the fragments
// TODO: de manière générale, définir une convention: pas de fragments sur les tables intermédiaires?
export const settings = {
  defaultValues: {
    encounter: {
      data: {}
    },
    state: {
      entity: {
        attributes: {}
      }
    }
  }
}

const minimal = gql`
  fragment encounter_state_minimal on encounter_state {
    id
  }
`

export const fragments = {
  minimal,
  base: gql`
    fragment encounter_state_base on encounter_state {
      ...encounter_state_minimal
      state {
        entity {
          ...entity_base
        }
      }
      encounter {
        id
        data
        type {
          ...encounter_type_base
        }
        states {
          state {
            id
          }
        }
        org_unit {
          ...org_unit_base
        }
      }
    }
    ${entity.fragments.base}
    ${encounterType.fragments.base}
    ${orgUnit.fragments.base}
    ${minimal}
  `
}

export const queries = {}

export const mutations = {
  // update: gql`
  //   mutation update_encounter_state($id: uuid!, $data: jsonb) {
  //     update_encounter_state(
  //       where: { id: { _eq: $id } }
  //       _append: { data: $data }
  //     ) {
  //       affected_rows
  //       returning {
  //         ...encounter_state_base
  //       }
  //     }
  //   }
  //   ${fragments.base}
  // `,
  /**
   * Updates an existing encounter and its entity. If nothing to change,
   * Set the encounter data or the entity attributes to {} (JSON append mode)
   * TODO: set the data/attributes to remove?
   */
  updateEntityAndEncounter: gql`
    mutation update_entity_and_encounter(
      $encounter_state_id: uuid # ID of the encounter_state
      $data: jsonb # new encounter data
      $attributes: jsonb # new entity attributes
    ) {
      update_entity(
        where: { states: { encounters: { id: { _eq: $encounter_state_id } } } }
        _append: { attributes: $attributes }
      ) {
        returning {
          ...entity_base
        }
      }
      update_encounter(
        where: { states: { id: { _eq: $encounter_state_id } } }
        _append: { data: $data }
      ) {
        returning {
          id
          data
          type {
            ...encounter_type_base
          }
          states {
            state {
              id
            }
          }
          org_unit {
            ...org_unit_base
          }
        }
      }
    }
    ${entity.fragments.base}
  `,
  /**
   * Creates a new encounter and a new entity, in a new state from the stage in params
   */
  insertEntityAndEncounter: gql`
    mutation insert_entity_and_encounter(
      $encounter_type_id: uuid
      $entity_type_id: uuid # entity type. Should be deducted from stage.workflow.entity_type
      $stage_id: uuid
      $org_unit_id: uuid # where the encounter occurs
      $data: jsonb # data of the encounter
      $attributes: jsonb # attributes of the entity
    ) {
      insert_encounter_state(
        objects: [
          {
            encounter: {
              data: {
                org_unit_id: $org_unit_id
                type_id: $encounter_type_id
                data: $data
              }
            }
            state: {
              data: {
                entity: {
                  data: { attributes: $attributes, type_id: $entity_type_id }
                }
                org_unit_id: $org_unit_id
                stage_id: $stage_id
              }
            }
          }
        ]
      ) {
        returning {
          ...encounter_state_base
        }
      }
    }
    ${fragments.base}
  `,
  /**
   * Inserts a new encounter into an existing state
   */
  // TODO: to be implemented and tested
  insertEncounterInState: gql`
    mutation insert_encounter_in_state(
      $state_id: uuid
      $encounter_type_id: uuid
      $entity_id: uuid
      $org_unit_id: uuid
      $data: jsonb
      $attributes: jsonb
    ) {
      insert_encounter_state(
        objects: [
          {
            state: {
              data: {
                id: $state_id
                entity: {
                  data: { id: $entity_id, attributes: $attributes }
                  on_conflict: {
                    constraint: entity_pkey
                    update_columns: [attributes] # does is append or replaces attributes?
                  }
                }
              }
            }
            encounter: {
              data: {
                type_id: $encounter_type_id
                org_unit_id: $org_unit_id
                data: $data
              }
            }
            state_id: $state_id
          }
        ]
      ) {
        returning {
          encounter {
            ...encounter_base
          }
        }
      }
    }
    ${encounter.fragments.base}
  `
}
