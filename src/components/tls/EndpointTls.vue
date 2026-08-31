<template>
  <v-card :subtitle="$t('objects.tls')">
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-select
          hide-details
          :label="$t('template')"
          :items="tlsItems"
          v-model="endpoint.tls_id">
        </v-select>
      </v-col>
    </v-row>
    <!-- OpenConnect and OpenVPN define their own TLS options rather than using
         sing-box's, so only the overlapping fields are carried over. Warn about
         the ones that would silently not apply. -->
    <v-alert
      v-if="unsupported.length > 0"
      type="warning"
      variant="tonal"
      density="compact"
      class="mt-2">
      {{ $t('tls.endpointUnsupported', { fields: unsupported.join(', ') }) }}
    </v-alert>
  </v-card>
</template>

<script lang="ts">
import { i18n } from '@/locales'

// Fields that carry real behaviour but have no equivalent on a given endpoint
// type. Must stay in step with unsupportedEndpointTLS in the panel core.
const unsupportedByType: Record<string, { side: 'server' | 'client'; fields: string[] }> = {
  'openvpn-server': { side: 'server', fields: ['certificate_provider', 'reality', 'ech', 'client_certificate_public_key_sha256'] },
  'openvpn-client': { side: 'client', fields: ['insecure', 'reality', 'ech', 'certificate_public_key_sha256'] },
  'openconnect': { side: 'client', fields: ['reality', 'ech', 'certificate_public_key_sha256'] },
}

export default {
  props: ['endpoint', 'tlsConfigs'],
  computed: {
    tlsItems(): any[] {
      return [
        { title: i18n.global.t('none'), value: 0 },
        ...(this.$props.tlsConfigs ?? []).map((t: any) => ({ title: t.name, value: t.id })),
      ]
    },
    unsupported(): string[] {
      const rule = unsupportedByType[this.$props.endpoint.type]
      if (!rule || !this.$props.endpoint.tls_id) return []
      const selected = (this.$props.tlsConfigs ?? []).find((t: any) => t.id === this.$props.endpoint.tls_id)
      if (!selected) return []
      const side = selected[rule.side]
      if (!side) return []
      return rule.fields.filter(f => {
        const value = side[f]
        if (value == undefined || value === false) return false
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'object') return value.enabled !== false
        return true
      })
    },
  },
}
</script>
