import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

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

type Props = {
  property: PropertyCardData
  selling?: boolean
  onSell: (assetType: 'house' | 'hotel' | 'property') => void
  pressableFeedback: (disabled?: boolean) => ({ pressed }: { pressed: boolean }) => {
    opacity: number
    transform: { scale: number }[]
  }
}

const headerClassMap: Record<string, string> = {
  brown: 'bg-[#8B5A2B]',
  light_blue: 'bg-[#8FD3FF]',
  pink: 'bg-[#ED69B2]',
  orange: 'bg-[#F59B23]',
  red: 'bg-[#E53E3E]',
  yellow: 'bg-[#F6D32D]',
  green: 'bg-[#2EAD63]',
  dark_blue: 'bg-[#1E63B8]',
  railroad: 'bg-slate-900',
  utility: 'bg-slate-300',
}

export default function PropertyCard({ property, selling = false, onSell, pressableFeedback }: Props) {
  const [rentOpen, setRentOpen] = useState(false)

  const isRailroad = property.color_group === 'railroad'
  const isUtility = property.color_group === 'utility'
  const headerClassName = headerClassMap[property.color_group] || 'bg-slate-700'
  const headerTextClassName = property.color_group === 'light_blue' || property.color_group === 'yellow' || isUtility
    ? 'text-slate-900'
    : 'text-white'
  const headerLabel = isRailroad
    ? 'Railroad'
    : isUtility
      ? 'Utility'
      : property.color_group.replace('_', ' ')
  const utilitySymbol = property.property_name.toLowerCase().includes('water') ? 'Water' : 'Power'

  const resaleItems = [
    ...(property.has_hotel
      ? [{ label: 'Hotel resale', value: property.hotel_resale_value }]
      : property.houses > 0
        ? [{ label: 'House resale', value: property.house_resale_value }]
        : []),
    { label: 'Property resale', value: property.property_resale_value },
  ]

  const visibleActions: Array<{ type: 'house' | 'hotel' | 'property'; label: string; className: string }> = []

  if (!property.can_upgrade) {
    if (property.can_sell_property) {
      visibleActions.push({
        type: 'property',
        label: `Sell Property (+${property.property_resale_value} Cr)`,
        className: 'bg-slate-800',
      })
    }
  } else if (property.has_hotel && property.can_sell_hotel) {
    visibleActions.push({
      type: 'hotel',
      label: `Sell Hotel (+${property.hotel_resale_value} Cr)`,
      className: 'bg-fuchsia-600',
    })
  } else if (property.houses > 0 && property.can_sell_house) {
    visibleActions.push({
      type: 'house',
      label: `Sell House (+${property.house_resale_value} Cr)`,
      className: 'bg-emerald-600',
    })
  } else if (property.can_sell_property) {
    visibleActions.push({
      type: 'property',
      label: `Sell Property (+${property.property_resale_value} Cr)`,
      className: 'bg-slate-800',
    })
  }

  return (
    <View className="overflow-hidden rounded-[24px] border border-slate-300 bg-white shadow-sm">
      <View className={`px-4 py-3 ${headerClassName}`}>
        <Text className={`text-center text-[9px] font-black uppercase tracking-[3px] ${headerTextClassName}`}>
          {headerLabel}
        </Text>
        <Text className={`mt-1.5 text-center text-base font-black ${headerTextClassName}`}>
          {property.property_name}
        </Text>
        <Text className={`mt-2 text-center text-[11px] font-bold ${headerTextClassName}`}>
          Tile {property.tile_number ?? '—'} {isRailroad ? '• Train Line' : isUtility ? `• ${utilitySymbol}` : ''}
        </Text>
      </View>

      <View className="gap-3 p-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Purchase</Text>
            <Text className="mt-0.5 text-sm font-black text-slate-900">{property.purchase_price} Cr</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Expected Rent</Text>
            <Text className="mt-0.5 text-sm font-black text-slate-900">{property.current_expected_rent} Cr</Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Houses</Text>
            <Text className="mt-0.5 text-sm font-black text-slate-900">{property.houses}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Hotel</Text>
            <Text className="mt-0.5 text-sm font-black text-slate-900">{property.has_hotel ? 'Yes' : 'No'}</Text>
          </View>
        </View>

        <View className="rounded-2xl bg-slate-50 px-3 py-3">
          <Text className="text-[10px] font-black uppercase tracking-[2px] text-slate-500">Resale Values</Text>
          <View className="mt-2 gap-1.5">
            {resaleItems.map((item) => (
              <View key={item.label} className="flex-row items-center justify-between gap-3">
                <Text className="text-sm text-slate-600">{item.label}</Text>
                <Text className="text-sm font-black text-slate-900">{item.value} Cr</Text>
              </View>
            ))}
          </View>
        </View>

        {!property.can_upgrade && (
          <View className="rounded-xl bg-slate-100 px-3 py-2">
            <Text className="text-xs font-bold text-slate-600">No upgrades available</Text>
          </View>
        )}

        <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Pressable
            onPress={() => setRentOpen((value) => !value)}
            style={pressableFeedback(false)}
            className="flex-row items-center justify-between px-3 py-2.5"
          >
            <Text className="text-sm font-black text-slate-800">View Rent Table</Text>
            <Text className="text-xs font-bold text-slate-500">{rentOpen ? 'Hide' : 'Show'}</Text>
          </Pressable>

          {rentOpen && (
            <View className="border-t border-slate-200 px-3 py-3">
              <View className="gap-1.5">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-700">Base rent</Text>
                  <Text className="text-sm font-black text-slate-900">{property.base_rent} Cr</Text>
                </View>
                {property.can_upgrade && (
                  <>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-slate-700">1 house</Text>
                      <Text className="text-sm font-black text-slate-900">{property.rent_1_house} Cr</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-slate-700">2 houses</Text>
                      <Text className="text-sm font-black text-slate-900">{property.rent_2_houses} Cr</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-slate-700">3 houses</Text>
                      <Text className="text-sm font-black text-slate-900">{property.rent_3_houses} Cr</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-slate-700">4 houses</Text>
                      <Text className="text-sm font-black text-slate-900">{property.rent_4_houses} Cr</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-slate-700">Hotel</Text>
                      <Text className="text-sm font-black text-slate-900">{property.rent_hotel} Cr</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          )}
        </View>

        {visibleActions.length > 0 && (
          <View className="gap-2">
            {visibleActions.map((action) => (
              <Pressable
                key={action.type}
                onPress={() => onSell(action.type)}
                disabled={selling}
                style={pressableFeedback(selling)}
                className={`h-11 items-center justify-center rounded-full ${action.className}`}
              >
                <Text className="font-black text-white">{action.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
