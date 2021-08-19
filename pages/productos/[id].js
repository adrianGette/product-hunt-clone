import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const Producto = () => {

    // state del componente
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({});


    // routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists) {
                    guardarProducto( producto.data() );
                } else {
                    guardarError(true);
                }
            }
            obtenerProducto();
        }
    }, [id, producto]);

    if(Object.keys(producto).length === 0) return 'Cargando. . .';

    const {
        comentarios,
        creado,
        descripcion,
        empresa,
        nombre,
        url,
        urlimagen,
        votos,
        creador,
        haVotado
    } = producto;

    // administrar y validar votos
    const votarProducto = () => {
        if(!usuario) {
            return router.push('/login')
        }

        // obtener y sumar un nuevo voto
        const nuevoTotalVotos = votos + 1;

        // verificar si el usuario actual votó
        if(haVotado.includes(usuario.uid)) return;

        // guardar el id del usuario que votó
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // actualizar en la base de datos
        firebase.db.collection('productos').doc(id).update({ 
            votos: nuevoTotalVotos, 
            haVotado: nuevoHaVotado 
        })

        // actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotalVotos
        })
    }

    // funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    const agregarComentario = e => {
        e.preventDefault();

        if(!usuario) {
            return router.push('/login')
        }

        // información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo
        const nuevosComentarios = [...comentarios, comentario];

        // actualizar la base de datos
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        // actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })
    }


    return (
        <Layout>
            <>
                {error && <Error404 />}

                <div className="contenedor">
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: { formatDistanceToNow( new Date(creado), {locale: es} ) }</p>

                            <p>Por: {creador.nombre} de {empresa}</p>

                            <img src={urlimagen} />

                            <p>{descripcion}</p>

                            { usuario && (
                                <>
                                    <h2>Agrega tu comentario</h2>

                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input 
                                                type="text"
                                                name="mensaje"
                                                onChange={comentarioChange}
                                            />
                                        </Campo>

                                        <InputSubmit 
                                            type="submit"
                                            value="Agregar Comentario"
                                        />
                                    </form>
                                </>
                            ) }

                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >Comentarios</h2>
                            
                            {comentarios.length === 0 ? "Todavía no hay comentarios" : (
                                <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por 
                                                <span
                                                    css={css`
                                                        font-weight: bold;
                                                    `}
                                                >{' '}{comentario.usuarioNombre}</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            
                        </div>

                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar URL</Boton>

                            

                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <p
                                    css={css`
                                        text-align: center;
                                    `}
                                >{votos} Votos</p>

                                { usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >Votar</Boton>
                                ) }

                            </div>
                        </aside>
                    </ContenedorProducto>
                </div>

            </>
        </Layout>
    );
}

export default Producto;
