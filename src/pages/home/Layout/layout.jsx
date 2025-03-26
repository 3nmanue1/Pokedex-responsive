import React, {useEffect, useState} from 'react';
import './layout.css';
import Header from '../header/header';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
import { URL_POKEMON } from '../../../apis/apiRest';
import Carta from '../carta/Carta';

function layout() {
  const[arrayPokemon, setArrayPokemon] = useState([]);
  const[totalPokemon, setTotalPokemon] = useState([]);
  const[xpage, setXpage]= useState(1);
  const[search, setSearch] = useState("");

  useEffect(() => {
      const api = async () => {
      const limit = 16;
      const xp = (xpage - 1) * limit;
      const pokeApi = await axios.get(`${URL_POKEMON}/?offset=${xp}&limit=${limit}`);
    
      setArrayPokemon(pokeApi.data.results);
    }
    api();
    getTotalPokemons();
  }, [xpage]);

  const getTotalPokemons = async () => {
    const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);
    const promises = res.data.results.map((pokemon) => {
      return pokemon;
    });

    const results = await Promise.all(promises)
    setTotalPokemon(results);
  }

  const filterPokemon = search?.length > 0
  ? totalPokemon?.length > 0 && totalPokemon.filter(pokemon => pokemon?.name?.toLowerCase().includes(search))
  : arrayPokemon

  const obtenerSearch = (e) => {
    const texto = e.toLowerCase()
    setSearch(texto);
    setXpage(1);
  }

  return (
    <div className='header_layout'>
      <Header obtenerSearch={obtenerSearch} />

      <section className='menu_poke'>
        <div className='opcion_poke'>
          <span className='btnizquierdo' onClick={() => {
              if (xpage === 1){
                return console.log("no puedes retroceder");
              }
              setXpage(xpage - 1);
            }}
            >
            <FaIcons.FaAngleLeft />
          </span>
          <span className='item_po'> {xpage} </span>
          <span className='item_po'> DE </span>
          <span className='item_po'> {Math.round(totalPokemon?.length /16)} </span>
          <span className='btnderecho'  onClick={() => {
              if (xpage === 67){
                return console.log("no puedes avanzar");
              }
              setXpage(xpage + 1);
            }}>  
            <FaIcons.FaAngleRight /> </span>
        </div>
      </section>
   
   <div className='contenedor_carta'>
     {filterPokemon.map((carta, index) => {
      return <Carta key={index} carta={carta} />
     })}
    </div>
    </div>
  )
}

export default layout;