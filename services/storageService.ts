import { supabase } from '../src/config/supabase';

const BUCKET = 'heartless-sprites';
const PUBLIC_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

export const uploadSprite = async (
  userId: string,
  partnerId: string,
  imageBlob: Blob,
  fileName: string
): Promise<string> => {
  try {
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `${userId}/${partnerId}/${Date.now()}_${sanitizedFileName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, imageBlob, { contentType: imageBlob.type || 'image/png', upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading sprite:', error);
    throw new Error('Failed to upload sprite');
  }
};

export const deleteSprite = async (spriteUrl: string): Promise<void> => {
  try {
    if (!spriteUrl) return;

    const idx = spriteUrl.indexOf(PUBLIC_PREFIX);
    if (idx === -1) {
      console.warn('Invalid sprite URL, cannot delete');
      return;
    }
    const path = decodeURIComponent(spriteUrl.slice(idx + PUBLIC_PREFIX.length).split('?')[0]);
    if (!path) {
      console.warn('Invalid sprite URL, cannot delete');
      return;
    }

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      // Swallow not-found; surface anything else.
      console.warn('Sprite may have already been deleted:', error.message);
    }
  } catch (error) {
    console.error('Error deleting sprite:', error);
  }
};

export const getSpriteUrl = async (userId: string, partnerId: string, fileName: string): Promise<string | null> => {
  try {
    const path = `${userId}/${partnerId}/${fileName}`;
    const { error } = await supabase.storage.from(BUCKET).download(path);
    if (error) return null;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
};

export const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};
