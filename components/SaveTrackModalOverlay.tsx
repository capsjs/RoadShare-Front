import { FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type TSaveTrackModalOverlay = {
  visible: boolean;
  onSave: () => void;
  onClear: () => void;
  onClose: () => void;
};

export const SaveTrackModalOverlay = ({
  visible,
  onSave,
  onClear,
  onClose,
}: TSaveTrackModalOverlay) => {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 items-center justify-center">
      <View className="h-40 w-[270px] bg-white rounded-2xl">
        <View className="flex flex-row justify-end">
          <FontAwesome6 name="xmark" size="20" onPress={onClear} />
        </View>

        <View className="flex flex-row justify-center items-center h-1/2 border-b-2 mb-2">
          <Text className="text-black font-JakartaSemiBold text-sm">
            Souhaitez-vous sauvegarder le trajet?
          </Text>
        </View>

        <View className="flex flex-row justify-evenly items-center">
          <TouchableOpacity
            className="p-2 bg-zinc-400/50 shadow-zinc-400 rounded-lg"
            onPress={onSave}
          >
            <Text>Sauvegarder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-zinc-400/50 p-2 shadow-zinc-400 rounded-lg"
            onPress={onClose}
          >
            <Text>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
