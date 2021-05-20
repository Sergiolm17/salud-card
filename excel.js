"use strict";
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");

const result = excelToJson({
    sourceFile:
        "D:/OneDrive - continental.edu.pe/Clinica Ortega no borrar/Salud Card/Beneficiarios2.xlsx",
});
const [header, ...content] = result.Sheet1;
console.log(header);
/*
{
  A: 'Nombre completo ( APELLIDO APELLIDO NOMBRE NOMBRE)',
  B: 'DNI',
  C: 'Dirección actual',
  D: 'Área en la que labora',
  E: 'Correo electrónico2',
  F: 'Numero de celular',
  G: 'PADRE || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  H: 'PAPÁ || DNI',
  I: 'MAMÁ || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  J: 'MAMÁ || DNI',
  K: 'ESPOSO(A) O CÓNYUGE || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  L: 'ESPOSO(A) O CÓNYUGE || DNI',
  M: 'HIJO 1 || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  N: 'HIJO 1 || DNI',
  O: 'HIJO 2 || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  P: 'HIJO 2 || DNI',
  Q: 'HIJO 3 || Nombre completo (APELLIDO APELLIDO NOMBRE NOMBRE)',
  R: 'HIJO 3 || DNI'
}*/
const saludcard = [];
content.forEach((people, indexpeople) => {
    //console.log(zfill(indexpeople + 1, 5)); // 324
    if (people.T !== "SI") return false;
    console.log(people);
    const beneficiarios = [];
    const beneficiario = {
        nombre: prilemayuscula(`${people.A}`),
        dni: `${people.B}`,
        area: `${people.D}`,
        condi: `${condicionlaboral(people.E)}`,
        code: `${zfill(people.W + 1, 5)}`,
    };
    //beneficiar a los padres
    //si papa
    if (validator(people.H, people.I))
        beneficiarios.push(addbeneficiario(people.H, people.I, "Padre"));
    //si mama
    if (validator(people.J, people.K))
        beneficiarios.push(addbeneficiario(people.J, people.K, "Madre"));
    //conyugue
    if (validator(people.L, people.M))
        beneficiarios.push(
            addbeneficiario(people.L, people.M, "Esposo(a) o Cónyuge"),
        );
    //HIJO 1
    if (validator(people.N, people.O))
        beneficiarios.push(addbeneficiario(people.N, people.O, "Hijo(a)"));
    //HIJO 2
    if (validator(people.P, people.Q))
        beneficiarios.push(addbeneficiario(people.P, people.Q, "Hijo(a)"));

    //HIJO 3
    if (validator(people.R, people.S))
        beneficiarios.push(addbeneficiario(people.R, people.S, "Hijo(a)"));

    let data1 = beneficiarios.filter((data1, i) => {
        if (i == 0 || i == 1 || i == 2) return true;
        else return false;
    });
    let data2 = beneficiarios.filter((data1, i) => {
        if (i == 3 || i == 4 || i == 5) return true;
        else return false;
    });

    saludcard.push({
        data: beneficiario,
        data1,
        data2,
    });
});

fs.writeFile("asset/data.json", JSON.stringify(saludcard), function (err) {
    if (err) throw err;
    console.log("complete");
});

function validator(variable1, variable2) {
    return variable1 !== undefined || variable2 !== undefined;
}

function addbeneficiario(nombrecomplete, dni, posicion) {
    return {
        nombre: prilemayuscula(`${nombrecomplete}`),
        dni: `${dni}`,
        posicion: `${posicion}`,
    };
}
function prilemayuscula(string) {
    return string.toUpperCase();
    //return string.replace(/\b\w/g, (l) => l.toUpperCase());
}
function zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
        if (number < 0) {
            return "-" + numberOutput.toString();
        } else {
            return numberOutput.toString();
        }
    } else {
        if (number < 0) {
            return "-" + zero.repeat(width - length) + numberOutput.toString();
        } else {
            return zero.repeat(width - length) + numberOutput.toString();
        }
    }
}
function condicionlaboral(texto) {
    switch (texto) {
        case "Planilla":
            return "PLA";
            break;
        case "Terceros":
            return "TEC";
            break;
        case "Médicos":
            return "MEC";
            break;
        case "Secretarias de médicos":
            return "SEC";
            break;
        default:
            return null;
            break;
    }
}
