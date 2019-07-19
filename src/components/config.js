const icons = {
  preferred_org_unit: 'location-arrow',
  created_at: 'clock',
  username: 'user',
  first_name: 'user-edit',
  last_name: 'user-edit',
  role_attributions: 'user-tag',
  name: 'tag',
  password: 'key',
  roles: 'user-lock',
  membership: 'sitemap',
  workflow: 'route',
  workflows: 'route',
  type: 'angle-double-up',
  language: 'language',
  user: {
    self: 'user'
  },
  role: {
    self: 'user-lock'
  },
  org_unit: {
    self: 'sitemap',
    parent: 'sitemap',
    children: 'sitemap'
  }
}
export const types = {
  password: 'password'
}
// TODO refaire un systeme plus malin, idealement calé sur le schema serveur
// Définir une icône par table et la déduire des relations. De cette manière,
// on déduit que user.memberships est de type org_unit[] et donc avec l'icône sitemap
export const icon = (form, name) => {
  if (icons[name]) {
    if (typeof icons[name] === 'string') return icons[name]
    else return icons[name].self
  } else if (icons[form]) {
    return icons[form][name]
  } else return undefined
}

export const FieldMixin = {
  props: {
    enter: Function,
    form: String,
    name: String,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value
      },
      set (localValue) {
        this.$emit('input', localValue)
      }
    },
    icon () {
      return icon(this.form, this.name)
    }
  }
}
