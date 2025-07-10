import {
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react'

type Place = {
  description: string;
  place_id: string;
};

type Props = {
  onSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
};

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;


const CustomPlacesInput = ({ onSelect } : Props) => {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.length < 2) {
      setPredictions([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchPredictions(input);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [input]);

  const fetchPredictions = async (search: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          search
        )}&key=${googlePlacesApiKey}&language=fr&components=country:fr`
      );
      const json = await res.json();
      setPredictions(json.predictions || []);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (place_id: string, description: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${googlePlacesApiKey}`
      );
      const json = await res.json();
      const location = json.result.geometry.location;
      onSelect({
        latitude: location.lat,
        longitude: location.lng,
        address: description,
      });
    } catch (error) {
      console.error('Error place details:', error);
    }
  };

  return (
    <View>
      <TextInput
        className='border border-s border-[#ccc] rounded-lg p-3 text-sm'
        placeholder="Où va-t-on?"
        value={input}
        onChangeText={setInput}
        placeholderTextColor="gray"
      />
      {loading && <ActivityIndicator size="small" />}
      <FlatList
        data={predictions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className='py-2'
            onPress={() => fetchPlaceDetails(item.place_id, item.description)}        
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
          )}
      />
    </View>
  )
}

export default CustomPlacesInput