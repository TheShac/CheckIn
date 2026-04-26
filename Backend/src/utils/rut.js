export const validarRUT = (rutCompleto) => {
  if (!rutCompleto) return false;

  const regex = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/;
  if (!regex.test(rutCompleto)) return false;

  const [numero, dv] = rutCompleto.split('-');
  const limpio = numero.replace(/\./g, '');

  let suma = 0;
  let multiplo = 2;

  for (let i = limpio.length - 1; i >= 0; i--) {
    suma += limpio[i] * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);

  let dvFinal =
    dvEsperado === 11 ? '0' :
    dvEsperado === 10 ? 'K' :
    dvEsperado.toString();

  return dvFinal.toLowerCase() === dv.toLowerCase();
};