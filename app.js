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


  const postDiv = document.querySelector('.postDiv')


  let currentLoggedInUser;
  let profilePicLocal;
  let postIdGlobal;
  
  //                     Authentication code
  
 
  
  


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
  <span  onclick="singleUser()">see all from this user</span>
 

  </div>
  `;
  
      postDiv.appendChild(div1);
      
  
      
    
    });
  }

  getPosts()


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
  


function singleUser(){
    window.location.href = './singleUser/index.html'

}
window.singleUser =singleUser;