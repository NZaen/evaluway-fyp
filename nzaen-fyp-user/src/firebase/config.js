import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {

    apiKey: "AIzaSyAjDL5bbzHC8PdhQwYp0qvkWIiBZYB0xE0",

    authDomain: "nzaen-fyp.firebaseapp.com",

    projectId: "nzaen-fyp",

    storageBucket: "nzaen-fyp.appspot.com",

    messagingSenderId: "503773467054",

    appId: "1:503773467054:web:063838eb94fe8ade24b83f",

    measurementId: "G-E81QC2W6VH"

};


//init firebase
firebase.initializeApp(firebaseConfig)

//init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

//timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }

