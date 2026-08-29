<template>
  <v-card subtitle="API">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          :label="$t('types.api.secret')"
          hide-details
          type="password"
          clearable
          @click:clear="delete data.secret"
          v-model="data.secret">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" align-self="center">
        <v-switch
          v-model="data.access_control_allow_private_network"
          color="primary"
          :label="$t('types.api.allowPrivateNetwork')"
          hide-details>
        </v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-combobox
          :label="$t('types.api.allowOrigin')"
          hide-details
          multiple
          chips
          closable-chips
          clearable
          @click:clear="delete data.access_control_allow_origin"
          v-model="data.access_control_allow_origin">
        </v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" align-self="center">
        <v-switch
          v-model="dashboardEnabled"
          color="primary"
          :label="$t('types.api.dashboard')"
          hide-details>
        </v-switch>
      </v-col>
      <v-col cols="12" sm="6" v-if="dashboardEnabled">
        <v-text-field
          :label="$t('types.api.dashboardPath')"
          hide-details
          clearable
          v-model="dashboardPath">
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
export default {
  props: ['data'],
  computed: {
    // dashboard accepts a bool, a path string, or an object; keep it in the
    // simplest form that expresses what the user picked.
    dashboardEnabled: {
      get(): boolean {
        const dashboard = this.$props.data?.dashboard
        if (typeof dashboard === 'boolean') return dashboard
        if (typeof dashboard === 'string') return dashboard.length > 0
        return dashboard?.enabled === true
      },
      set(v: boolean) {
        if (!v) {
          delete this.$props.data.dashboard
          return
        }
        this.$props.data.dashboard = true
      }
    },
    dashboardPath: {
      get(): string {
        const dashboard = this.$props.data?.dashboard
        if (typeof dashboard === 'string') return dashboard
        if (dashboard && typeof dashboard === 'object') return dashboard.path ?? ''
        return ''
      },
      set(v: string) {
        this.$props.data.dashboard = v ? v : true
      }
    },
  },
}
</script>
