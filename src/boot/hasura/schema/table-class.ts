import {
  TableDefinition,
  RelationshipForeignKeyDefinition,
  RelationshipManualDefinition,
  TableRef,
  ColumnRef
} from './tables-definition'
import { Schema } from './schema'
import {
  BaseProperty,
  ColumnProperty,
  RelationshipProperty,
  Mapping
} from './properties'
import Handlebars from 'handlebars'
import { getHandlebarsVars } from 'src/helpers'
import { ObjectMap } from 'src/types/common'

export class TableClass {
  public labelTemplate = '{{name}}' // TODO
  public readonly table: TableDefinition
  private readonly schema: Schema
  private readonly labelCompiledTemplate: HandlebarsTemplateDelegate
  public readonly properties: BaseProperty[]
  public constructor(schema: Schema, table: TableDefinition) {
    this.schema = schema
    this.table = table
    this.properties = [
      ...table.columns.map(column => new ColumnProperty(this, column)),
      ...table.relationships.map(
        relationship => new RelationshipProperty(this, relationship)
      )
    ]
    this.labelCompiledTemplate = Handlebars.compile(this.labelTemplate)
  }

  public get jsonObjectElement() {
    return {
      ...this.jsonObjectColumns,
      ...this.jsonObjectLabel,
      ...this.jsonObjectRelationships,
      ...this.jsonObjectIds
    }
  }

  public get jsonObjectList() {
    return {
      ...this.jsonObjectLabel,
      ...this.jsonObjectIds
    }
  }

  private get jsonObjectLabel() {
    return getHandlebarsVars(this.labelTemplate)
  }

  private get jsonObjectColumns() {
    return this.columnProperties.reduce<ObjectMap>((prev, relationship) => {
      prev[relationship.name] = true
      return prev
    }, {})
  }

  private get jsonObjectRelationships() {
    return this.relationshipProperties.reduce<ObjectMap>(
      (prev, relationship) => {
        prev[relationship.name] = relationship.reference.jsonObjectList
        return prev
      },
      {}
    )
  }

  private get jsonObjectIds() {
    return this.idColumnNames.reduce<ObjectMap>((prev, name) => {
      prev[name] = true
      return prev
    }, {})
  }

  public get name() {
    return this.table.table_name
  }
  public label(element: ObjectMap) {
    return this.labelCompiledTemplate(element)
  }
  public get idProperties() {
    return this.columnProperties.filter(property => property.isId)
  }
  public get idColumnNames() {
    return this.idProperties.map(property => property.name)
  }
  public getProperty(name: string) {
    return this.properties.find(property => property.name === name)
  }
  public getColumnProperty(name: string) {
    return this.columnProperties.find(property => property.name === name)
  }
  public getRelationshipProperty(name: string) {
    return this.relationshipProperties.find(property => property.name === name)
  }
  public get relationshipProperties() {
    return this.properties.filter(
      property => 'mapping' in property
    ) as RelationshipProperty[]
  }
  public get columnProperties() {
    return this.properties.filter(
      property => !('mapping' in property)
    ) as ColumnProperty[]
  }
  public linkProperties() {
    // TODO: simplify the following three blocks!!!
    for (const relationship of this.table.relationships) {
      if ('foreign_key_constraint_on' in relationship.definition) {
        const {
          foreign_key_constraint_on: fkDefinition
        } = relationship.definition as RelationshipForeignKeyDefinition
        if (typeof fkDefinition === 'string') {
          const fkColumnName = fkDefinition as string
          const fkConstraint = this.table.foreign_keys.find(constraint =>
            Object.keys(constraint.column_mapping).includes(fkColumnName)
          )
          const relationshipProperty = this.getRelationshipProperty(
            relationship.name
          )
          if (fkConstraint && relationshipProperty) {
            const referenceClass = this.schema.getClass(
              fkConstraint.ref_table_name
            )
            if (referenceClass) {
              const mapping: Mapping[] = []
              for (const key of Object.keys(fkConstraint.column_mapping)) {
                const from = this.getColumnProperty(key)
                const to = referenceClass.getColumnProperty(
                  fkConstraint.column_mapping[key]
                )
                if (from && to) mapping.push({ from, to })
              }
              relationshipProperty.linkProperty(mapping)
            }
          }
        } else {
          const {
            table: fkTableName,
            column: fkColumnName
          } = fkDefinition as ColumnRef
          const referenceClass = this.schema.getClass(fkTableName)
          if (referenceClass) {
            const fkConstraint = referenceClass.table.foreign_keys.find(
              constraint =>
                Object.keys(constraint.column_mapping).includes(fkColumnName)
            )
            const relationshipProperty = this.getRelationshipProperty(
              relationship.name
            )
            if (fkConstraint && relationshipProperty) {
              const mapping: Mapping[] = []
              for (const key of Object.keys(fkConstraint.column_mapping)) {
                const from = this.getColumnProperty(
                  fkConstraint.column_mapping[key]
                )
                const to = referenceClass.getColumnProperty(key)
                if (from && to) mapping.push({ from, to })
              }
              relationshipProperty.linkProperty(mapping)
            }
          }
        }
      } else {
        const {
          manual_configuration: {
            remote_table: remoteTable,
            column_mapping: columnMapping
          }
        } = relationship.definition as RelationshipManualDefinition
        const relationshipProperty = this.getRelationshipProperty(
          relationship.name
        )
        if (relationshipProperty) {
          const refTableName =
            typeof remoteTable === 'string'
              ? remoteTable
              : (remoteTable as TableRef).name
          const referenceClass = this.schema.getClass(refTableName)
          if (referenceClass) {
            const mapping: Mapping[] = []
            for (const key of Object.keys(columnMapping)) {
              const from = this.getColumnProperty(key)
              const to = referenceClass.getColumnProperty(columnMapping[key])
              if (from && to) mapping.push({ from, to })
              else
                console.error(
                  'One of the properties in the mapping has not been found'
                )
            }
            relationshipProperty.linkProperty(mapping)
          }
        }
      }
    }
  }
}
