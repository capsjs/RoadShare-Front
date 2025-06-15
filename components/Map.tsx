import { View, Text } from 'react-native'
import MapView, { PROVIDER_DEFAULT } from "react-native-maps"

const Map = () => {
  return (
   <MapView provider={PROVIDER_DEFAULT} className='h-full w-full rounded-2xl'
   />    
  )
}

export default Map;