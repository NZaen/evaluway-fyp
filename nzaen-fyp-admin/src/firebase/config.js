import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const firebaseConfig = {

    apiKey: "AIzaSyAjDL5bbzHC8PdhQwYp0qvkWIiBZYB0xE0",

    authDomain: "nzaen-fyp.firebaseapp.com",

    projectId: "nzaen-fyp",

    storageBucket: "nzaen-fyp.appspot.com",

    messagingSenderId: "503773467054",

    appId: "1:503773467054:web:96f83db141a62f0024b83f",

    measurementId: "G-PBHPQSZJ6L"

};



//init firebase
firebase.initializeApp(firebaseConfig)







const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

//timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }