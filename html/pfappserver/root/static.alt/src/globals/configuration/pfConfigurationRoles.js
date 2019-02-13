import i18n from '@/utils/locale'
import pfFormInput from '@/components/pfFormInput'
import {
  pfConfigurationListColumns,
  pfConfigurationListFields,
  pfConfigurationValidatorsFromMeta
} from '@/globals/configuration/pfConfiguration'
import {
  and,
  not,
  conditional,
  hasRoles,
  roleExists
} from '@/globals/pfValidators'

const {
  integer,
  required,
  alphaNum,
  maxLength
} = require('vuelidate/lib/validators')

export const pfConfigurationRolesListColumns = [
  { ...pfConfigurationListColumns.id, ...{ label: i18n.t('Name') } }, // re-label
  pfConfigurationListColumns.notes,
  pfConfigurationListColumns.max_nodes_per_pid,
  pfConfigurationListColumns.buttons
]

export const pfConfigurationRolesListFields = [
  { ...pfConfigurationListFields.id, ...{ text: i18n.t('Name') } }, // re-text
  pfConfigurationListFields.notes
]

export const pfConfigurationRoleListConfig = (context = {}) => {
  return {
    columns: pfConfigurationRolesListColumns,
    fields: pfConfigurationRolesListFields,
    rowClickRoute (item, index) {
      return { name: 'role', params: { id: item.id } }
    },
    searchPlaceholder: i18n.t('Search by name or description'),
    searchableOptions: {
      searchApiEndpoint: 'config/roles',
      defaultSortKeys: ['id'],
      defaultSearchCondition: {
        op: 'and',
        values: [{
          op: 'or',
          values: [
            { field: 'id', op: 'contains', value: null },
            { field: 'notes', op: 'contains', value: null }
          ]
        }]
      },
      defaultRoute: { name: 'roles' }
    },
    searchableQuickCondition: (quickCondition) => {
      return {
        op: 'and',
        values: [
          {
            op: 'or',
            values: [
              { field: 'id', op: 'contains', value: quickCondition },
              { field: 'notes', op: 'contains', value: quickCondition }
            ]
          }
        ]
      }
    }
  }
}

export const pfConfigurationRoleViewFields = (context = {}) => {
  const {
    isNew = false,
    isClone = false,
    options: {
      allowed_values = {},
      meta = {},
      placeholders = {}
    }
  } = context

  return [
    {
      tab: null, // ignore tabs
      fields: [
        {
          label: i18n.t('Name'),
          fields: [
            {
              key: 'id',
              component: pfFormInput,
              attrs: {
                disabled: (!isNew && !isClone),
                placeholder: placeholders.id
              },
              validators: {
                ...pfConfigurationValidatorsFromMeta(meta.id, 'Name'),
                ...{ // TODO: remove once meta is available for `id`
                  [i18n.t('Name required.')]: required,
                  [i18n.t('Role exists.')]: not(and(required, conditional(isNew || isClone), hasRoles, roleExists))
                }
              }
            }
          ]
        },
        {
          label: i18n.t('Description'),
          fields: [
            {
              key: 'notes',
              component: pfFormInput,
              attrs: {
                placeholder: placeholders.notes
              },
              validators: pfConfigurationValidatorsFromMeta(meta.notes, 'Description')
            }
          ]
        },
        {
          label: i18n.t('Max nodes per user'),
          text: i18n.t('The maximum number of nodes a user having this role can register. A number of 0 means unlimited number of devices.'),
          fields: [
            {
              key: 'max_nodes_per_pid',
              component: pfFormInput,
              attrs: {
                type: 'number',
                placeholder: placeholders.max_nodes_per_pid
              },
              validators: pfConfigurationValidatorsFromMeta(meta.max_nodes_per_pid, 'Max nodes per user')
            }
          ]
        }
      ]
    }
  ]
}
