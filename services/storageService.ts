import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../src/config/firebase';

export const uploadSprite = async (
  userId: string,
  partnerId: string,
  imageBlob: Blob,
  fileName: string
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `sprites/${userId}/${partnerId}/${timestamp}_${sanitizedFileName}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading sprite:', error);
    throw new Error('Failed to upload sprite');
  }
};

export const deleteSprite = async (spriteUrl: string): Promise<void> => {
  try {
    if (!spriteUrl) return;

    // Extract the path from the Firebase Storage URL
    const url = new URL(spriteUrl);
    const path = url.pathname.split('/o/')[1]?.split('?')[0];

    if (!path) {
      console.warn('Invalid sprite URL, cannot delete');
      return;
    }

    const decodedPath = decodeURIComponent(path);
    const storageRef = ref(storage, decodedPath);

    await deleteObject(storageRef);
  } catch (error: any) {
    // If the file doesn't exist, that's okay
    if (error.code === 'storage/object-not-found') {
      console.warn('Sprite not found, may have been already deleted');
      return;
    }
    console.error('Error deleting sprite:', error);
    throw new Error('Failed to delete sprite');
  }
};

export const getSpriteUrl = async (userId: string, partnerId: string, fileName: string): Promise<string | null> => {
  try {
    const storagePath = `sprites/${userId}/${partnerId}/${fileName}`;
    const storageRef = ref(storage, storagePath);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    if (error.code === 'storage/object-not-found') {
      return null;
    }
    console.error('Error getting sprite URL:', error);
    throw new Error('Failed to get sprite URL');
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
