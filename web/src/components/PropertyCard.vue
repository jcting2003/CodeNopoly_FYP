<template>
  <article
    class="property-card overflow-hidden rounded-[1.4rem] border border-slate-300 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
    :class="cardShellClass"
  >
    <header class="border-b border-slate-900/10 px-4 py-3 text-center text-white" :class="headerClass">
      <p class="text-[9px] font-black uppercase tracking-[0.24em] opacity-80">
        {{ headerLabel }}
      </p>
      <h3 class="mt-1.5 text-base font-black tracking-tight">
        {{ property.property_name }}
      </h3>
      <div class="mt-2 flex items-center justify-center gap-2 text-[11px] font-bold">
        <span
          v-if="isRailroad"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900"
        >
          <span class="material-symbols-outlined text-base">train</span>
        </span>
        <span
          v-else-if="isUtility"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-900"
        >
          <span class="material-symbols-outlined text-base">
            {{ utilityIcon }}
          </span>
        </span>
        <span class="rounded-full bg-white/15 px-2.5 py-1">
          Tile {{ property.tile_number ?? '—' }}
        </span>
      </div>
    </header>

    <div class="space-y-3 px-4 py-4 text-slate-800">
      <div class="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Purchase</p>
          <p class="mt-0.5 font-black">{{ property.purchase_price }} Cr</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Expected Rent</p>
          <p class="mt-0.5 font-black">{{ property.current_expected_rent }} Cr</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Houses</p>
          <p class="mt-0.5 font-black">{{ property.houses }}</p>
        </div>
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Hotel</p>
          <p class="mt-0.5 font-black">{{ property.has_hotel ? 'Yes' : 'No' }}</p>
        </div>
      </div>

      <div class="rounded-2xl bg-slate-50 px-3 py-3">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Resale Values</p>
        <div class="mt-2 space-y-1.5 text-sm">
          <div
            v-for="item in resaleItems"
            :key="item.label"
            class="flex items-center justify-between gap-3"
          >
            <span class="text-slate-600">{{ item.label }}</span>
            <span class="font-black text-slate-900">{{ item.value }} Cr</span>
          </div>
        </div>
      </div>

      <div
        v-if="!property.can_upgrade"
        class="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"
      >
        No upgrades available
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white">
        <button
          type="button"
          class="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-black text-slate-800"
          @click="rentOpen = !rentOpen"
        >
          <span>View Rent Table</span>
          <span class="text-xs text-slate-500">{{ rentOpen ? 'Hide' : 'Show' }}</span>
        </button>
        <div v-if="rentOpen" class="border-t border-slate-200 px-3 py-3">
          <div class="space-y-1.5 text-sm">
            <div class="flex items-center justify-between">
              <span>Base rent</span>
              <span class="font-black">{{ property.base_rent }} Cr</span>
            </div>
            <template v-if="property.can_upgrade">
              <div class="flex items-center justify-between">
                <span>1 house</span>
                <span class="font-black">{{ property.rent_1_house }} Cr</span>
              </div>
              <div class="flex items-center justify-between">
                <span>2 houses</span>
                <span class="font-black">{{ property.rent_2_houses }} Cr</span>
              </div>
              <div class="flex items-center justify-between">
                <span>3 houses</span>
                <span class="font-black">{{ property.rent_3_houses }} Cr</span>
              </div>
              <div class="flex items-center justify-between">
                <span>4 houses</span>
                <span class="font-black">{{ property.rent_4_houses }} Cr</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Hotel</span>
                <span class="font-black">{{ property.rent_hotel }} Cr</span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div v-if="visibleActions.length > 0" class="space-y-2 pt-0.5">
        <button
          v-for="action in visibleActions"
          :key="action.type"
          type="button"
          @click="$emit('sell', action.type)"
          :disabled="selling"
          class="w-full rounded-2xl px-4 py-2.5 text-sm font-black text-white transition disabled:opacity-45"
          :class="action.className"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type PropertyCardData = {
  property_id: number
  property_name: string
  tile_number: number | null
  color_group: string
  owner_name: string | null
  purchase_price: number
  base_rent: number
  rent_1_house: number
  rent_2_houses: number
  rent_3_houses: number
  rent_4_houses: number
  rent_hotel: number
  house_purchase_cost: number
  hotel_purchase_cost: number
  can_upgrade: boolean
  houses: number
  has_hotel: boolean
  house_resale_value: number
  hotel_resale_value: number
  property_resale_value: number
  current_expected_rent: number
  can_sell_house: boolean
  can_sell_hotel: boolean
  can_sell_property: boolean
}

const props = defineProps<{
  property: PropertyCardData
  selling?: boolean
}>()

defineEmits<{
  (e: 'sell', assetType: 'house' | 'hotel' | 'property'): void
}>()

const rentOpen = ref(false)
const group = computed(() => props.property.color_group)
const isRailroad = computed(() => group.value === 'railroad')
const isUtility = computed(() => group.value === 'utility')

const headerClass = computed(() => {
  const groupClassMap: Record<string, string> = {
    brown: 'bg-[#8B5A2B]',
    light_blue: 'bg-[#8FD3FF] text-slate-900',
    pink: 'bg-[#ED69B2]',
    orange: 'bg-[#F59B23]',
    red: 'bg-[#E53E3E]',
    yellow: 'bg-[#F6D32D] text-slate-900',
    green: 'bg-[#2EAD63]',
    dark_blue: 'bg-[#1E63B8]',
    railroad: 'bg-[linear-gradient(135deg,#111827,#475569)]',
    utility: 'bg-[linear-gradient(135deg,#E5E7EB,#CBD5E1)] text-slate-900',
  }

  return groupClassMap[group.value] || 'bg-slate-700'
})

const cardShellClass = computed(() => {
  if (isRailroad.value) return 'ring-1 ring-slate-900/10'
  if (isUtility.value) return 'ring-1 ring-slate-400/20'
  return ''
})

const headerLabel = computed(() => {
  if (isRailroad.value) return 'Railroad'
  if (isUtility.value) return 'Utility'
  return group.value.replace('_', ' ')
})

const utilityIcon = computed(() => {
  return props.property.property_name.toLowerCase().includes('water') ? 'water_drop' : 'electric_bolt'
})

const resaleItems = computed(() => {
  const items = [
    {
      label: 'Property resale',
      value: props.property.property_resale_value,
    },
  ]

  if (props.property.has_hotel) {
    items.unshift({
      label: 'Hotel resale',
      value: props.property.hotel_resale_value,
    })
  } else if (props.property.houses > 0) {
    items.unshift({
      label: 'House resale',
      value: props.property.house_resale_value,
    })
  }

  return items
})

const visibleActions = computed(() => {
  const actions: Array<{ type: 'house' | 'hotel' | 'property'; label: string; className: string }> = []

  if (!props.property.can_upgrade) {
    if (props.property.can_sell_property) {
      actions.push({
        type: 'property',
        label: `Sell Property (+${props.property.property_resale_value} Cr)`,
        className: 'bg-slate-800',
      })
    }

    return actions
  }

  if (props.property.has_hotel && props.property.can_sell_hotel) {
    actions.push({
      type: 'hotel',
      label: `Sell Hotel (+${props.property.hotel_resale_value} Cr)`,
      className: 'bg-fuchsia-600',
    })
    return actions
  }

  if (props.property.houses > 0 && props.property.can_sell_house) {
    actions.push({
      type: 'house',
      label: `Sell House (+${props.property.house_resale_value} Cr)`,
      className: 'bg-emerald-600',
    })
    return actions
  }

  if (props.property.can_sell_property) {
    actions.push({
      type: 'property',
      label: `Sell Property (+${props.property.property_resale_value} Cr)`,
      className: 'bg-slate-800',
    })
  }

  return actions
})
</script>
