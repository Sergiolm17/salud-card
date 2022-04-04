var express = require("express");
var app = express();
const excelToJson = require("convert-excel-to-json");
const fileUpload = require("express-fileupload");

var port = process.env.PORT || 8080;

const PDFDocument = require("pdfkit");
const fs = require("fs");
app.use(express.static("app/build"));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);
app.post("/", async function (req, res, next) {
    console.log(req.files);
    const result = excelToJson({
        sourceFile: req.files.fileUploaded.tempFilePath,
    });
    const [header, ...content] = result.Sheet1;
    //console.log(header);
    const saludcard = [];
    content.forEach((people, indexpeople) => {
        //console.log(zfill(indexpeople + 1, 5)); // 324
        //if (people.T !== "SI") return false;
        //console.log(people);

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
                addbeneficiario(people.L, people.M, "Esposo(a) o Cónyuge")
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

        let data1 = beneficiarios;

        saludcard.push({
            data: beneficiario,
            data1,
        });
    });
    const cardsize = {
        with: cmToPt(5.41),
        height: cmToPt(8.66),
    };

    options = {
        size: [cardsize.with, cardsize.height],
        //"page-size": "A4",
        margins: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        },
        dpi: 400,
        bufferPages: true,
    };
    var doc = new PDFDocument(options);

    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
            "Content-Length": Buffer.byteLength(pdfData),
            "Content-Type": "application/pdf",
            "Content-disposition": "attachment;filename=DOCUMENTO.pdf",
        }).end(pdfData);
    });

    const carta1 = {
        x: 0,
        y: 0,
        marginleft: 13,
    };
    const carta2 = {
        x: 0,
        y: 0,
        marginleft: 17,
        gap: 25,
        gapy: 110,
    };
    saludcard.forEach((element, saludcardid) => {
        doc.image("asset/cara1.png", carta1.x, carta1.y, {
            width: cardsize.with,
            height: cardsize.height,
        });

        //doc.moveDown();
        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(8)
            .text(
                element.data.nombre,
                carta1.x + carta1.marginleft,
                carta1.y + 80,
                {
                    align: "left",
                    continued: false,
                }
            );
        doc.moveDown();

        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(9)
            .text("DNI:", carta1.x + carta1.marginleft, carta1.y + 94, {
                continued: false,
            });

        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6)
            .text(
                element.data.dni,
                carta1.x + carta1.marginleft + 19,
                carta1.y + 97,
                {
                    continued: false,
                }
            );

        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(9)
            .text("Área:", carta1.x + carta1.marginleft + 52, carta1.y + 94, {
                continued: false,
            });

        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6)
            .text(
                element.data.area,
                carta1.x + carta1.marginleft + 78,
                carta1.y + 97,
                {
                    continued: false,
                }
            );
        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(7)
            .text(
                `${element.data.condi}-${element.data.code}`,
                carta1.x + 110,
                carta1.y + 9,
                {
                    align: "left",
                    continued: false,
                }
            );

        //////////////////////////////////////////////////
        doc.addPage();
        //console.log(element.data1.length);
        //console.log(element.data2.length);

        doc.image("asset/cara2.png", carta2.x, carta2.y, {
            width: cardsize.with,
            height: cardsize.height,
        });
        if (element.data1.length == 0) {
        } else {
            doc.fillColor("#153e6b")
                .font("fonts/OpenSans-Bold.ttf")
                .fontSize(14)
                .text(
                    "Beneficiarios:",
                    carta2.x + carta2.marginleft,
                    carta2.y + 15,
                    {}
                );
        }

        element.data1.forEach((beneficiario, id) => {
            doc.fillColor("#0e4e99")
                .font("fonts/OpenSans-Regular.ttf")
                .fontSize(6.35)
                .text(
                    beneficiario.nombre,
                    carta2.x + carta2.marginleft,
                    carta2.y + 40 + id * carta2.gap,
                    {
                        align: "left",
                        continued: false,
                    }
                );
            doc.moveDown();

            doc.fillColor("#153e6b")
                .font("fonts/OpenSans-Bold.ttf")
                .fontSize(6.7)
                .text(
                    "DNI:",
                    carta2.x + carta2.marginleft,
                    carta2.y + 50 + id * carta2.gap,
                    {
                        continued: false,
                    }
                );
            doc.fillColor("#153e6b")
                .font("fonts/OpenSans-Bold.ttf")
                .fontSize(6.7)
                .text(
                    "|  " + beneficiario.posicion,
                    carta2.x + carta2.marginleft + 53,
                    carta2.y + 50 + id * carta2.gap,
                    {
                        continued: false,
                    }
                );

            doc.fillColor("#0e4e99")
                .font("fonts/OpenSans-Regular.ttf")
                .fontSize(6.7)
                .text(
                    beneficiario.dni,
                    carta2.x + 32,
                    carta2.y + 50 + id * carta2.gap,
                    {
                        continued: false,
                    }
                );
        });

        if (saludcard.length - 1 !== saludcardid) doc.addPage();
    });

    doc.end();
});
function cmToPt(cm) {
    return cm * 28.3465;
}
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
