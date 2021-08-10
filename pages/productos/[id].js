import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Producto = () => {

    // routing para obtener el id actual
    const router = useRouter();
    const { query: { id } } = router;

    useEffect(() => {
        if(id) {
            console.log('Ya hay un id ', id);
        }
    }, [id]);

    return ( <h1>{id}</h1> );
}

export default Producto;
