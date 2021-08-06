export default function validarCrearProducto(valores) {

    let errores = {};

    // validar el nombre del usuario
    if(!valores.nombre) {
        errores.nombre = "El Nombre es obligatorio";
    }

    // validar empresa
    if(!valores.empresa) {
        errores.empresa = "El Nombre de la empresa es obligatorio";
    }

    // validar la URL
    if(!valores.url) {
        errores.url = "La URL del producto es obligatoria";
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "URL no válida";
    }

    // validar descripción
    if(!valores.descripcion) {
        errores.descripcion = "Agrega una descripción de tu producto";
    }
    

    return errores;

}