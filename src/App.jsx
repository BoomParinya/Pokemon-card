import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

//Components
import FavPoke from "./components/FavPoke";

function App() {
  const [poke, setPoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [number, setNumber] = useState(1);
  const [fav, setFav] = useState([]);

  useEffect(() => {
    let abortController = new AbortController();

    const loadPoke = async () => {
      try {
        setLoading(true);
        let response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`, {
          signal: abortController.signal,
        });

        setPoke(response.data);
        setError("");

      } catch (error) {
        setError("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };

    loadPoke();

    return () => abortController.abort();
  }, [number]);

  console.log(poke);

  const prevPoke = () => {
    setNumber((number) => number - 1)
  }

  const nextPoke = () => {
    setNumber((number) => number + 1)
  }

  const addFav = () => {
    setFav((oldState) => [...oldState, poke])
  }

  console.log("Pokemon ID:", number);
  console.log("Your fav Pokemon:", fav)

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-white dark:border-gray-200">
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
        <div>
          { loading ? <p>Loading...</p> 
          : 
          <>
            <h1 className='text-5xl flex justify-center items-center'>{poke?.name}</h1>
            <div className='flex justify-center items-center py-3'>
              <button className='bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded' onClick={addFav}>Add to favorite</button>
            </div>
            <br />
            <img src={poke?.sprites?.other?.home.front_default} alt={poke?.home} />
            <ul className='grid justify-center items-center my-4'>
              {poke?.abilities?.map((abil, idx) => (
                <li key={idx}>{abil.ability.name}</li>
              ))}
            </ul>
            <div className="flex justify-center items-center"> 
              <button className='bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded' onClick={prevPoke} style={{ marginRight: '10px' }}>Previous</button>
              <button className='bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded' onClick={nextPoke} style={{ marginRight: '10px' }}>Next</button>
            </div>
          </>}
        </div> 
        <div>
          <h2 className='flex justify-center items-center'>My favorite pokemon</h2>
          {
            fav.length > 0 ? <FavPoke fav={fav} /> 
            : 
            <div className='flex h-full justify-center items-center'>
              <p>No favorite pokemon...</p>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default App;

