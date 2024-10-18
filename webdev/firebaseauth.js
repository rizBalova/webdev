// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
   apiKey: "AIzaSyB6c0FpgDGGSjLqJWQQgk7NMJdcrJXPy_8",
   authDomain: "login-register-d71d9.firebaseapp.com",
   projectId: "login-register-d71d9",
   storageBucket: "login-register-d71d9.appspot.com",
   messagingSenderId: "520309435822",
   appId: "1:520309435822:web:fbdfc23756822a31e9ec3f",
   measurementId: "G-Z3H8RF1QHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message, divId){
   var messageDiv=document.getElementById(divId);
   messageDiv.style.display="block";
   messageDiv.innerHTML=message;
   messageDiv.style.opacity=1;
   setTimeout(function(){
       messageDiv.style.opacity=0;
   },5000);
}
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('rEmail').value;
   const password=document.getElementById('rPassword').value;
   const firstName=document.getElementById('fName').value;
   const lastName=document.getElementById('lName').value;
   const role = document.getElementById('role').value;

   const auth=getAuth();
   const db=getFirestore();

   createUserWithEmailAndPassword(auth, email, password, role)
   .then((userCredential)=>{
       const user=userCredential.user;
       const userData={
           email: email,
           firstName: firstName,
           lastName:lastName,
           role: role,
       };
       showMessage('Account Created Successfully', 'signUpMessage');
       const docRef=doc(db, "users", user.uid);
       setDoc(docRef,userData)
       .then(()=>{
           window.location.href='index.html';
       })
       .catch((error)=>{
           console.error("error writing document", error);

       });
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode=='auth/email-already-in-use'){
           showMessage('Email Address Already Exists !!!', 'signUpMessage');
       }
       else{
           showMessage('unable to create User', 'signUpMessage');
       }
   })
});

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('email').value;
   const password=document.getElementById('password').value;
   const role=document.getElementById('role').value
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email, password, role)
   //.then((userCredential)=>{
    auth.onAuthStateChanged(user => {
        if (user) {
            // Jika user login, cek apakah mereka admin
            db.collection('users').doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();
                        if (userData.role === 'admin') {
                            // Jika admin, biarkan akses halaman admin
                            console.log("User is admin");
                        } else {
                            // Jika bukan admin, arahkan ke halaman user
                            window.location.href = 'homepage.html';
                        }
                    } else {
                        console.log("No such document!");
                        window.location.href = 'index.html'; // Arahkan ke halaman login jika tidak ada data user
                    }
                })
                .catch(error => {
                    console.log("Error getting document:", error);
                    window.location.href = 'index.html'; // Arahkan ke halaman login jika terjadi error
                });
        } else {
            // Jika pengguna belum login, arahkan ke halaman login
            window.location.href = 'index.html';
        }
    });
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
           showMessage('Incorrect Email or Password', 'signInMessage');
       }
       else{
           showMessage('Account does not Exist', 'signInMessage');
       }
   })
   showMessage('login is successful', 'signInMessage');
