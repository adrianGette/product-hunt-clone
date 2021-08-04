import React, { useState, useEffect } from 'react';

const useValidacion = (stateInicial, validar, fn) => {

    const [ valores, guardarValores ] = useState(stateInicial);
    const [ errores, guardarErrores ] = useState({});
    const [ submitForm, guardarSubmitForm ] = useState(false);

    useEffect( () => {
        if(submitForm) {
            // Object.keys para revisar si el objeto tiene contenido
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores) {
                fn(); // función que se ejecuta en el componente
            }
            guardarSubmitForm(false);
        }
    }, [errores]);

    // función que se ejecuta mientras el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    // función que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange
    }
}

export default useValidacion;