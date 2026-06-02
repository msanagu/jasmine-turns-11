import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBwDm4Qw5BPd2kuO0NEOPWMcOIF2wPP7nU',
  authDomain: 'jasmine-turns-11.firebaseapp.com',
  projectId: 'jasmine-turns-11',
  storageBucket: 'jasmine-turns-11.firebasestorage.app',
  messagingSenderId: '750727010490',
  appId: '1:750727010490:web:79dd0ee2b3583fc22a4a83',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
