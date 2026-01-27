import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../src/config/firebase';
import { Partner, Trait, Preference, InteractionLog } from '../types';

// Partner CRUD Operations

export const createPartner = async (userId: string, partnerData: Omit<Partner, 'id'>): Promise<string> => {
  try {
    const partnerId = doc(collection(db, 'partners')).id;
    const partnerWithId = { ...partnerData, id: partnerId, userId };

    await setDoc(doc(db, 'partners', partnerId), {
      ...partnerWithId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return partnerId;
  } catch (error) {
    console.error('Error creating partner:', error);
    throw new Error('Failed to create partner');
  }
};

export const getPartners = async (userId: string): Promise<Partner[]> => {
  try {
    const q = query(collection(db, 'partners'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const partners: Partner[] = [];
    for (const docSnap of querySnapshot.docs) {
      const partnerData = docSnap.data() as Partner;

      // Fetch subcollections
      const traits = await getTraits(docSnap.id);
      const preferences = await getPreferences(docSnap.id);
      const logs = await getInteractionLogs(docSnap.id);

      partners.push({
        ...partnerData,
        traits,
        preferences,
        interactionLog: logs,
      });
    }

    return partners;
  } catch (error) {
    console.error('Error getting partners:', error);
    throw new Error('Failed to fetch partners');
  }
};

export const getPartner = async (partnerId: string): Promise<Partner | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'partners', partnerId));

    if (!docSnap.exists()) {
      return null;
    }

    const partnerData = docSnap.data() as Partner;

    // Fetch subcollections
    const traits = await getTraits(partnerId);
    const preferences = await getPreferences(partnerId);
    const logs = await getInteractionLogs(partnerId);

    return {
      ...partnerData,
      traits,
      preferences,
      interactionLog: logs,
    };
  } catch (error) {
    console.error('Error getting partner:', error);
    throw new Error('Failed to fetch partner');
  }
};

export const updatePartner = async (partnerId: string, updates: Partial<Partner>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'partners', partnerId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    throw new Error('Failed to update partner');
  }
};

export const deletePartner = async (partnerId: string): Promise<void> => {
  try {
    // Delete subcollections first
    const traitsSnapshot = await getDocs(collection(db, 'partners', partnerId, 'traits'));
    const preferencesSnapshot = await getDocs(collection(db, 'partners', partnerId, 'preferences'));
    const checklistSnapshot = await getDocs(collection(db, 'partners', partnerId, 'checklist'));
    const logsSnapshot = await getDocs(collection(db, 'partners', partnerId, 'logs'));

    const deletePromises = [
      ...traitsSnapshot.docs.map(d => deleteDoc(d.ref)),
      ...preferencesSnapshot.docs.map(d => deleteDoc(d.ref)),
      ...checklistSnapshot.docs.map(d => deleteDoc(d.ref)),
      ...logsSnapshot.docs.map(d => deleteDoc(d.ref)),
    ];

    await Promise.all(deletePromises);

    // Delete partner document
    await deleteDoc(doc(db, 'partners', partnerId));
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw new Error('Failed to delete partner');
  }
};

// Traits Operations

export const addTrait = async (partnerId: string, trait: Omit<Trait, 'id'>): Promise<string> => {
  try {
    const traitId = doc(collection(db, 'partners', partnerId, 'traits')).id;
    await setDoc(doc(db, 'partners', partnerId, 'traits', traitId), {
      ...trait,
      id: traitId,
    });
    return traitId;
  } catch (error) {
    console.error('Error adding trait:', error);
    throw new Error('Failed to add trait');
  }
};

export const getTraits = async (partnerId: string): Promise<Trait[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'partners', partnerId, 'traits'));
    return querySnapshot.docs.map(doc => doc.data() as Trait);
  } catch (error) {
    console.error('Error getting traits:', error);
    return [];
  }
};

export const updateTrait = async (partnerId: string, traitId: string, updates: Partial<Trait>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'partners', partnerId, 'traits', traitId), updates);
  } catch (error) {
    console.error('Error updating trait:', error);
    throw new Error('Failed to update trait');
  }
};

export const deleteTrait = async (partnerId: string, traitId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'partners', partnerId, 'traits', traitId));
  } catch (error) {
    console.error('Error deleting trait:', error);
    throw new Error('Failed to delete trait');
  }
};

// Preferences Operations

export const addPreference = async (partnerId: string, preference: Omit<Preference, 'id'>): Promise<string> => {
  try {
    const prefId = doc(collection(db, 'partners', partnerId, 'preferences')).id;
    await setDoc(doc(db, 'partners', partnerId, 'preferences', prefId), {
      ...preference,
      id: prefId,
    });
    return prefId;
  } catch (error) {
    console.error('Error adding preference:', error);
    throw new Error('Failed to add preference');
  }
};

export const getPreferences = async (partnerId: string): Promise<Preference[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'partners', partnerId, 'preferences'));
    return querySnapshot.docs.map(doc => doc.data() as Preference);
  } catch (error) {
    console.error('Error getting preferences:', error);
    return [];
  }
};

export const deletePreference = async (partnerId: string, preferenceId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'partners', partnerId, 'preferences', preferenceId));
  } catch (error) {
    console.error('Error deleting preference:', error);
    throw new Error('Failed to delete preference');
  }
};

// Checklist Operations

export const addChecklistItem = async (
  partnerId: string,
  item: { label: string; isCompleted: boolean; order: number }
): Promise<string> => {
  try {
    const itemId = doc(collection(db, 'partners', partnerId, 'checklist')).id;
    await setDoc(doc(db, 'partners', partnerId, 'checklist', itemId), {
      ...item,
      id: itemId,
    });
    return itemId;
  } catch (error) {
    console.error('Error adding checklist item:', error);
    throw new Error('Failed to add checklist item');
  }
};

export const updateChecklistItem = async (
  partnerId: string,
  itemId: string,
  updates: { label?: string; isCompleted?: boolean }
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'partners', partnerId, 'checklist', itemId), updates);
  } catch (error) {
    console.error('Error updating checklist item:', error);
    throw new Error('Failed to update checklist item');
  }
};

export const deleteChecklistItem = async (partnerId: string, itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'partners', partnerId, 'checklist', itemId));
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    throw new Error('Failed to delete checklist item');
  }
};

// Interaction Log Operations

export const addInteractionLog = async (partnerId: string, log: Omit<InteractionLog, 'id'>): Promise<string> => {
  try {
    const logId = doc(collection(db, 'partners', partnerId, 'logs')).id;
    await setDoc(doc(db, 'partners', partnerId, 'logs', logId), {
      ...log,
      id: logId,
    });
    return logId;
  } catch (error) {
    console.error('Error adding interaction log:', error);
    throw new Error('Failed to add interaction log');
  }
};

export const getInteractionLogs = async (partnerId: string): Promise<InteractionLog[]> => {
  try {
    const q = query(
      collection(db, 'partners', partnerId, 'logs'),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as InteractionLog);
  } catch (error) {
    console.error('Error getting interaction logs:', error);
    return [];
  }
};

// Real-time Listeners

export const subscribeToPartners = (userId: string, callback: (partners: Partner[]) => void): Unsubscribe => {
  const q = query(collection(db, 'partners'), where('userId', '==', userId));

  return onSnapshot(q, async (snapshot) => {
    const partners: Partner[] = [];
    for (const docSnap of snapshot.docs) {
      const partnerData = docSnap.data() as Partner;

      // Fetch subcollections
      const traits = await getTraits(docSnap.id);
      const preferences = await getPreferences(docSnap.id);
      const logs = await getInteractionLogs(docSnap.id);

      partners.push({
        ...partnerData,
        traits,
        preferences,
        interactionLog: logs,
      });
    }
    callback(partners);
  });
};

export const subscribeToPartner = (partnerId: string, callback: (partner: Partner | null) => void): Unsubscribe => {
  return onSnapshot(doc(db, 'partners', partnerId), async (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }

    const partnerData = docSnap.data() as Partner;

    // Fetch subcollections
    const traits = await getTraits(partnerId);
    const preferences = await getPreferences(partnerId);
    const logs = await getInteractionLogs(partnerId);

    callback({
      ...partnerData,
      traits,
      preferences,
      interactionLog: logs,
    });
  });
};
