import { supabase } from "../utils/supabase";
// Use the legacy import to avoid the 'File' constructor error
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { Platform } from "react-native";

class SupabaseService {
  bucket = "images";

  /**
   * Extracts the storage file path from a Supabase public URL.
   * e.g. "https://xxx.supabase.co/storage/v1/object/public/images/profiles/profile_123.jpg"
   *   → "profiles/profile_123.jpg"
   */
  getPathFromUrl(url) {
    if (!url) return null;
    try {
      // The path after "/public/<bucket>/" is the file path inside the bucket
      const marker = `/public/${this.bucket}/`;
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      return url.substring(idx + marker.length);
    } catch {
      return null;
    }
  }

  /**
   * Deletes a file from Supabase storage by its public URL.
   * Silently ignores errors — a failed delete should never block an upload.
   */
  async deleteByUrl(url) {
    const path = this.getPathFromUrl(url);
    if (!path) return;
    try {
      const { error } = await supabase.storage.from(this.bucket).remove([path]);
      if (error) console.warn("Supabase delete warning:", error.message);
    } catch (err) {
      console.warn("Supabase delete failed silently:", err.message);
    }
  }

  /**
   * Uploads a new profile image and deletes the old one if it exists.
   * @param {string} uri        - Local URI of the new image
   * @param {string} oldUrl     - Current profileImage URL to delete (optional)
   */
  async uploadUserImage(uri, oldUrl = null) {
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
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
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

      const newUrl = urlData.publicUrl;

      // Delete the old image AFTER the new one is successfully uploaded
      // never end up with no image if the delete fails
      if (oldUrl) {
        await this.deleteByUrl(oldUrl);
      }

      return newUrl;
    } catch (err) {
      console.log("Supabase Upload Error:", err.message);
      return null;
    }
  }
}

const storageService = new SupabaseService();
export default storageService;
