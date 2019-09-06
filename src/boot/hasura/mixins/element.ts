import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from './hasura'
import { ObjectMap } from 'src/types/common'
import { pick } from 'src/helpers'

@Component
export class ElementMixin extends Mixins(HasuraMixin) {
  public element!: ObjectMap

  public get label() {
    if (Object.keys(this.element).length) {
      return this.tableClass.label(this.element)
    } else return undefined
  }

  public linkToElement(action: string = 'read') {
    return {
      path: '/data/' + this.tableName + '/' + action,
      query: pick(this.element, this.tableClass.idColumnNames)
    }
  }
}
