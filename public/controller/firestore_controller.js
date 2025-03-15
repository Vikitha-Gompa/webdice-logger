import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

import { app } from './firebase_core.js';
import { currentUser } from "./firebase_auth.js";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const COLLECTION_DICE = 'diceroll_game';

export async function addPlayRecord(record) {
    const docRef = await addDoc(collection(db, COLLECTION_DICE), record);
}

export async function getPlayRecordList() {
    let recordList = [];
    const q = query(
        collection(db, COLLECTION_DICE),
        where('email', '==', currentUser.email),
        orderBy('timestamp', 'desc'),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const t = { docId: doc.id, ...doc.data() };
        recordList.push(t);
    });
    return recordList;
}

export async function deletePlayRecords(){
    const q = query(
        collection(db, COLLECTION_DICE),
        where('email', '==', currentUser.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });

}