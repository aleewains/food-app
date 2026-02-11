import { supabase } from "../utils/supabase";
// Use the legacy import to avoid the 'File' constructor error
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { Platform } from "react-native";

class SupabaseService {
  bucket = "images";

  async uploadUserImage(uri) {
    if (!uri) return null;

    try {
      const fileExt = uri.split(".").pop();
      const fileName = `profile_${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      let fileBody;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        fileBody = await response.blob();
      } else {
        // MOBILE LOGIC: Using legacy readAsStringAsync
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Convert Base64 string to ArrayBuffer for Supabase
        fileBody = decode(base64);
      }

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, fileBody, {
          contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error("Supabase Upload Error:", err.message);
      return null;
    }
  }
}

const storageService = new SupabaseService();
export default storageService;
