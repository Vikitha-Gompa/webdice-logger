import { 
    getFirestore,
    collection,
     addDoc,
 } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js" ;

import {app} from './firebase_core.js';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const COLLECTION_TICTACTOE = 'tictactoe_game';

export async function addPlayRecord(record){
    const docRef = await addDoc(collection(db, COLLECTION_TICTACTOE), record);
}