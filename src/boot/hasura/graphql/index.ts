import { jsonToGraphQLQuery, VariableType } from 'json-to-graphql-query'
import gql from 'graphql-tag'
import { set } from 'object-path'
import { Ability } from '@casl/ability'
import { permittedFieldsOf } from '@casl/ability/extra'
import { TableClass } from '../schema'
import { ObjectMap } from 'src/types/common'
import { RelationshipProperty } from '../schema/properties'

/**
 * * Filters the 'JSON object' and removes the properties that are not permitted with the ability
 * @param tableClass
 * @param jsonObject 'JSON object' as per defined in https://github.com/dupski/json-to-graphql-query
 * @param ability Casl ability
 */
const filteredJsonObject = (
  tableClass: TableClass,
  jsonObject: ObjectMap,
  ability: Ability
) => {
  const permittedFields = permittedFieldsOf(ability, 'select', tableClass.name)
  const result: ObjectMap = {}
  for (const fieldName of Object.keys(jsonObject)) {
    const subObject = jsonObject[fieldName]
    if (typeof subObject === 'object' && !Array.isArray(subObject)) {
      const relationship = tableClass.getRelationshipProperty(fieldName)
      if (relationship && subObject) {
        const subObjectResult = filteredJsonObject(
          relationship.reference,
          subObject,
          ability
        )
        if (Object.keys(subObjectResult).length)
          result[fieldName] = subObjectResult
      } else result[fieldName] = subObject
    } else if (permittedFields.includes(fieldName)) {
      result[fieldName] = subObject
    }
  }
  return result
}

const encapsulateGraphQlQuery = (
  tableClass: TableClass,
  jsonObject: ObjectMap
) => ({
  query: { [tableClass.name]: jsonObject }
})

export const listGraphQlQuery = (tableClass: TableClass, ability: Ability) =>
  gql(
    jsonToGraphQLQuery(
      encapsulateGraphQlQuery(
        tableClass,
        filteredJsonObject(tableClass, tableClass.jsonObjectList, ability)
      ),
      { pretty: true }
    )
  )

// TODO customiser?
export const optionsGraphQlQuery = (
  property: RelationshipProperty,
  ability: Ability
) => listGraphQlQuery(property.reference, ability)

export const elementGraphQlQuery = (
  tableClass: TableClass,
  ability: Ability
) => {
  const baseQuery = encapsulateGraphQlQuery(
    tableClass,
    filteredJsonObject(tableClass, tableClass.jsonObjectElement, ability)
  )
  set(
    baseQuery,
    'query.__variables',
    tableClass.idProperties.reduce<ObjectMap>((result, property) => {
      result[property.name] = property.type
      return result
    }, {})
  )
  set(baseQuery, `query.${tableClass.name}.__args`, {
    where: {
      _and: tableClass.idColumnNames.map(name => ({
        [name]: { _eq: new VariableType(name) }
      }))
    }
  })
  return gql(jsonToGraphQLQuery(baseQuery, { pretty: true }))
}
