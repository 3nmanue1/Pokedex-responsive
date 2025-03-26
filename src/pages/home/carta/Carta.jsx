import React, { useEffect, useState } from 'react';
import "./Carta.css";
import axios from 'axios';
import { URL_EVOLUTION, URL_POKEMON, URL_SPECIES } from '../../../apis/apiRest';

function Carta({ carta }) {
    const [itemPokemon, setItemPokemon] = useState({});
    const [speciesPokemon, setSpeciesPokemon] = useState({});
    const [evolucionPokemon, setEvolucionPokemon] = useState([]);

    useEffect(() => {
        const dataPokemon = async () => {
            const api = await axios.get(`${URL_POKEMON}/${carta.name}`);
            setItemPokemon(api.data);
        };
        dataPokemon();
    }, [carta]);

    useEffect(() => {
        const dataspecie = async () => {
            const URL = carta.url.split("/");
            const api = await axios.get(`${URL_SPECIES}/${URL[6]}`);
            setSpeciesPokemon({
                url_especie: api?.data?.evolution_chain?.url, // Asegúrate de que es un URL válido
                data: api.data
            });
        };
        dataspecie();
    }, [carta]);

    useEffect(() => {
        if (speciesPokemon?.url_especie) {
            async function obtenerEvolucion() {
                const arrayEvolucion = [];
                const URL = speciesPokemon?.url_especie.split("/");
                const api = await axios.get(`${URL_EVOLUTION}/${URL[6]}`);

                const chain = api?.data?.chain;
                if (chain) {
                    // Primer Pokémon (de la cadena de evolución)
                    const url2 = chain?.species?.url.split("/");
                    const img1 = await getPokemonImagen(url2[6]);
                    arrayEvolucion.push({
                        img: img1,
                        name: chain?.species?.name,
                    });

                    // Si tiene una segunda evolución
                    if (chain?.evolves_to?.length > 0) {
                        const Data2 = chain?.evolves_to[0]?.species;
                        const ID = Data2?.url?.split("/");
                        const img2 = await getPokemonImagen(ID[6]);
                        arrayEvolucion.push({
                            img: img2,
                            name: Data2?.name,
                        });
                    }

                    // Si tiene una tercera evolución
                    if (chain?.evolves_to?.[0]?.evolves_to?.length > 0) {
                        const Data3 = chain?.evolves_to[0]?.evolves_to[0]?.species;
                        const ID = Data3?.url?.split("/");
                        const img3 = await getPokemonImagen(ID[6]);
                        arrayEvolucion.push({
                            img: img3,
                            name: Data3?.name,
                        });
                    }

                    setEvolucionPokemon(arrayEvolucion);
                }
            }

            obtenerEvolucion();
        }
    }, [speciesPokemon]);

    async function getPokemonImagen(id) {
        const response = await axios.get(`${URL_POKEMON}/${id}`);
        return response?.data?.sprites?.other["official-artwork"]?.front_default;
    }

    let pokeId = itemPokemon?.id?.toString();
    if (pokeId?.length === 1) {
        pokeId = "000" + pokeId;
    } else if (pokeId?.length === 2) {
        pokeId = "00" + pokeId;
    }

    return (
        <div className='contenedor'>
            {/* Siempre muestra la imagen del Pokémon, aunque no tenga evolución */}
            <img src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} alt="Pokemon" />
            <div className={`bg-${speciesPokemon?.data?.color?.name} info_poke`}>
                <strong className='id_poke'> #{pokeId} </strong>
                <strong className='name_poke'> {itemPokemon.name} </strong>
                <h4 className='altura_poke'>Altura: {itemPokemon.height} m</h4>
                <h4 className='peso_poke'>Peso: {itemPokemon.weight} kg</h4>
                <h4 className='habitat_poke'>Habitat: {speciesPokemon?.data?.habitat?.name}</h4>

                <div className='stats_poke'>
                    {itemPokemon?.stats?.map((sta, index) => {
                        return (
                            <h6 key={index} className='stats_base'>
                                <span className='stats_nombre'>{sta.stat.name}</span>
                                <progress className='stats_progreso' value={sta.base_stat} max={110}></progress>
                                <span className='stats_num'>{sta.base_stat}</span>
                            </h6>
                        );
                    })}
                </div>

                <div className='tipos_poke'>
                    {itemPokemon?.types?.map((ty, index) => {
                        return <h6 className={`color-${ty.type.name} tipo_color`} key={index}> {ty.type.name}</h6>;
                    })}
                </div>

                {/* Solo muestra la sección de evoluciones si hay Pokémon evolucionados */}
                {evolucionPokemon.length > 0 && (
                    <div className='contenedor_pokeevo'>
                        {evolucionPokemon.map((evo, index) => {
                            return (
                                <div key={index} className='contenedor_evo'>
                                    <img src={evo.img} alt="evo" />
                                    <h6>{evo.name}</h6>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Carta;