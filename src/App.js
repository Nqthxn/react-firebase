import { useState, useEffect, useTransition } from 'react';
import './App.css';
import {Auth} from "./components/auth";
import {db, auth, storage} from './config/firebase';
import {getDocs, collection, addDoc, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {ref, uploadBytes} from 'firebase/storage';
import { upload } from '@testing-library/user-event/dist/upload';

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(0);
  const [isOscar, setIsOscar] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try{
      const data = await getDocs(moviesCollectionRef);
      const filterData = data.docs.map((doc) => (
        {
          ...doc.data(),
          id: doc.id
        }
      ));
      setMovieList(filterData);
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, [])

  const onSubmit = async () => {
    try{
      await addDoc(moviesCollectionRef, {
        title: newTitle,
        releaseDate : newDate,
        receiveAnOscar : isOscar,
        userId : auth?.currentUser?.uid
      });
      getMovieList();
    }catch(err){
      console.error(err);
    }
  };


  const deleteMovie = async (id) => {
    try{
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    }catch (err){
      console.error(err);
    }
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, {title: updateTitle});
    getMovieList();
  };

  const updateFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
      await uploadBytes(filesFolderRef, fileUpload);
    }catch(err){
      console.error(err);
    }


  }



  return (
    <div className="App">
      <Auth />
      <div>
        <input 
          placeholder="Movie title..."
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input 
          placeholder="Release Date..."
          type="number"
          onChange={(e) => setNewDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={isOscar}
          onChange={(e) => setIsOscar(e.target.checked)}/>
        <label>Received an Oscar</label>
        <button onClick={onSubmit}>Submit Movie</button>

      </div>


      <div>
        {movieList.map((movie => (
          <div>
            <h1 style={{color: movie.receiveAnOscar ? "green" : "red"}}>{movie.title}</h1>
            <p>Date : {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input 
              placeholder="new title..."
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
          </div>
        )))}
      </div>



      <div>
        <input type="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        /> 
        <button onClick={updateFile}>Upload File</button>
      </div>
    </div>

  );
}

export default App;
