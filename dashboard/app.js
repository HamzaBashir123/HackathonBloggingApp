import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut,
  setDoc,
  addDoc,
  collection,
  getDocs,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "../firebase.Config.js";

const loginBtn = document.querySelector(".logoutBtn");
const userNAme = document.querySelector(".loginBtn");


let currentLoggedInUser;
let profilePicLocal;
let postIdGlobal;

//                     Authentication code

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    currentLoggedInUser = uid;
    console.log(uid);
    getUserData(uid);
    // ...
  } else {
    // User is signed out
    console.log("sign out");
    window.location.href = "../index.html";
  }
});





//                     Get User Data


async function getUserData(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { firstName, lastName } = docSnap.data();
      leftCreateData(firstName, lastName);
    //   placeholderNameSet(firstName, lastName);

      // leftCreateData(username, firebaseSurname, profilePicture);
      // placeholderNameSet(username, firebaseSurname, profilePicture);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error, "==>>error in get User Data");
  }
}

function leftCreateData(firstName, lastName){
    firstName = firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
    lastName = lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
    userNAme.innerHTML = firstName +' '+ lastName

}





async function getAuthorData(authorUid) {
  // console.log(authorUid, "==>>authorUid")

  const docRef = doc(db, "users", authorUid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}

//   Logout functionality

const logoutHandler = () => {
  console.log("logout chal gaya");
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("signout successfully");
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};
loginBtn.addEventListener("click", logoutHandler);



// Post Handler

const blogTitle = document.querySelector('.blogTitle')
const blogDescription = document.querySelector('.blogDescription')
const signUpBtn = document.querySelector('.signUpBtn')



async function postHandler(){
    console.log(currentLoggedInUser)
      
        try {
          const response = await addDoc(collection(db, "blogs"), {
            blogContent: blogDescription.value,
            authorId: currentLoggedInUser,
            time: serverTimestamp(),
            blogTitle: blogTitle.value
           
          });
      
          // console.log(response.id)
          getPosts();
        blogDescription.value = "";
        blogTitle.value = "";
        } catch (e) {
          console.error("Error adding document: ", e);
        }
     
      
}

signUpBtn.addEventListener('click',postHandler)

const postDiv = document.querySelector('.postDiv')
getPosts();

// Get Post Data 
async function getPosts() {
    postDiv.innerHTML = "";
    const postsCollectionRef = collection(db, "blogs");
    const sortedQuery = query(postsCollectionRef, orderBy("time", "desc"));
  
    const querySnapshot = await getDocs(sortedQuery);
    querySnapshot.forEach(async (doc) => {
      
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      let postId = doc.id;
      const { authorId, blogContent, blogTitle, time } = doc.data();
      // console.log(doc.id ,"=====> post Id " )
    
  
      let { firstName, lastName } = await getAuthorData(authorId);
      firstName =
        firstName.slice(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
      lastName =
        lastName.slice(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
  
      // console.log(authorDetails)
      let setTime = new Date(time.seconds * 1000);
      // console.log(setTime.toString().split('GMT')[0]);
      let dateTime = setTime.toString().split("GMT")[0];
  
      var div1 = document.createElement("div");
      div1.setAttribute("class", "appendDiv");
      div1.innerHTML = `     <div class="d-flex">
      <img  class="blogPicture" src="../assets/profile.png" alt="" style="height: 60px; width: 60px;">
      <div class="titleNameTime ms-2">
          <h6 class="p-0 m-0 mt-3">${blogTitle}</h6>
          <span>${firstName +" "+ lastName} </span><span>${dateTime}
          </span>

      </div>
  </div>
  <div class="contentDiv ">
      <p class="mb-3">${blogContent}
  </p>
  <span class="deletePost" onclick="deletePostHandler('${postId}')">Delete</span>
  <span class="editPost" onclick="editPostHandler('${postId}')">Edit</span>
 

  </div>
  `;
  
      postDiv.appendChild(div1);
  
      
    
    });
  }


//   Delete Post 

async function deletePostHandler(postId) {
    console.log("delete funtion chal gaya");
    console.log(postId, "delete button working properly");
  
    await deleteDoc(doc(db, "blogs", postId));
  
    alert("Your post deleted successfully");
    getPosts();
  }
  
  window.deletePostHandler = deletePostHandler;
  

//   Edit Button

const popUPCapturefullScreen = document.querySelector(".popUPCapturefullScreen");
const popUpButton = document.querySelector(".popUpButton");
const popUpCross = document.querySelector(".popUpCross");
const textArea = document.querySelector(".textArea");
const editInput = document.querySelector(".editInput");
popUpCross.addEventListener("click", () => {
    popUPCapturefullScreen.style.display = "none";
  });



async function editPostHandler(postId) {
    popUPCapturefullScreen.style.display = "block";
    console.log(postId, "edit button working properly");
    const docRef = doc(db, "blogs", postId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const { blogContent, blogTitle ,authorId} = docSnap.data();
      textArea.innerHTML = blogContent;
      editInput.value = blogTitle;
      postIdGlobal = authorId;
      
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

window.editPostHandler = editPostHandler;

async function updateData() {
    console.log(postIdGlobal)
    try {
      const washingtonRef = doc(db, "blogs", postIdGlobal);
      const response = await updateDoc(washingtonRef, {
        blogContent: textArea.value,
        blogTitle: editInput.value,
    
        
      });

    //   await updateDoc(washingtonRef, {
    //       postContent: "kuch bhi"
    //   });

    //   console.log(response.id)
      getPosts();
      popUPCapturefullScreen.style.display = "none";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  popUpButton.addEventListener('click',updateData)