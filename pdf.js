const PDFGenerator = require("pdfkit");
const fs = require("fs");
const saludcard = require("./asset/data.json");
const cardsize = {
    with: cmToPt(8.66),
    height: cmToPt(5.41),
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
};

// instantiate the library
let doc = new PDFGenerator(options);

const carta1 = {
    x: 0,
    y: 0,
    marginleft: 17,
};
const carta2 = {
    x: 0,
    y: 0,
    marginleft: 17,
    gap: 25,
    gapy: 110,
};

// pipe to a writable stream which would save the result into the same directory
doc.pipe(
    fs.createWriteStream(
        "D:/OneDrive - continental.edu.pe/Clinica Ortega no borrar/Salud Card/Beneficiario.pdf",
    ),
);

saludcard.forEach((element, saludcardid) => {
    doc.image("asset/cara1.png", carta1.x, carta1.y, {
        width: cardsize.with,
        height: cardsize.height,
    });

    doc.fillColor("#153e6b")
        .font("fonts/OpenSans-Bold.ttf")
        .fontSize(12)
        .text("Titular:", carta1.x + carta1.marginleft, carta1.y + 15);
    //doc.moveDown();
    doc.fillColor("#0e4e99")
        .font("fonts/OpenSans-Regular.ttf")
        .fontSize(9.5)
        .text(
            element.data.nombre,
            carta1.x + carta1.marginleft,
            carta1.y + 31.3,
            {
                align: "left",
                continued: false,
            },
        );
    doc.moveDown();

    doc.fillColor("#153e6b")
        .font("fonts/OpenSans-Bold.ttf")
        .fontSize(12)
        .text("DNI:", carta1.x + carta1.marginleft, carta1.y + 45, {
            continued: false,
        });

    doc.fillColor("#0e4e99")
        .font("fonts/OpenSans-Regular.ttf")
        .fontSize(8)
        .text(element.data.dni, carta1.x + 46, carta1.y + 48, {
            continued: false,
        });

    doc.fillColor("#153e6b")
        .font("fonts/OpenSans-Bold.ttf")
        .fontSize(12)
        .text("Área:", carta1.x + 90, carta1.y + 45, {
            continued: false,
        });

    doc.fillColor("#0e4e99")
        .font("fonts/OpenSans-Regular.ttf")
        .fontSize(8)
        .text(element.data.area, carta1.x + 124, carta1.y + 48, {
            continued: false,
        });
    doc.fillColor("#0e4e99")
        .font("fonts/OpenSans-Regular.ttf")
        .fontSize(8)
        .text(
            `${element.data.condi}-${element.data.code}`,
            carta1.x + 195,
            carta1.y + 83,
            {
                align: "left",
                continued: false,
            },
        );

    //////////////////////////////////////////////////
    doc.addPage();
    //console.log(element.data1.length);
    //console.log(element.data2.length);

    doc.image("asset/cara2.png", carta2.x, carta2.y, {
        width: cardsize.with,
        height: cardsize.height,
    });
    if (element.data1.length == 0 && element.data2.length == 0) {
    } else {
        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(12)
            .text(
                "Beneficiarios:",
                carta2.x + carta2.marginleft,
                carta2.y + 12,
                {},
            );
    }

    element.data1.forEach((beneficiario, id) => {
        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6.35)
            .text(
                beneficiario.nombre,
                carta2.x + carta2.marginleft,
                carta2.y + 31.3 + id * carta2.gap,
                {
                    align: "left",
                    continued: false,
                },
            );
        doc.moveDown();

        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(6.7)
            .text(
                "DNI:",
                carta2.x + carta2.marginleft,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );
        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(6.7)
            .text(
                "|  " + beneficiario.posicion,
                carta2.x + carta2.marginleft + 53,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );

        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6.7)
            .text(
                beneficiario.dni,
                carta2.x + 33,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );
    });
    element.data2.forEach((beneficiario, id) => {
        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6.35)
            .text(
                beneficiario.nombre,
                carta2.x + carta2.marginleft + carta2.gapy,
                carta2.y + 31.3 + id * carta2.gap,
                {
                    align: "left",
                    continued: false,
                },
            );

        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(6.7)
            .text(
                "DNI:",
                carta2.x + carta2.marginleft + carta2.gapy,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );
        doc.fillColor("#153e6b")
            .font("fonts/OpenSans-Bold.ttf")
            .fontSize(6.7)
            .text(
                "|  " + beneficiario.posicion,
                carta2.x + carta2.marginleft + 53 + carta2.gapy,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );

        doc.fillColor("#0e4e99")
            .font("fonts/OpenSans-Regular.ttf")
            .fontSize(6.7)
            .text(
                beneficiario.dni,
                carta2.x + 33 + carta2.gapy,
                carta2.y + 42 + id * carta2.gap,
                {
                    continued: false,
                },
            );
    });

    if (saludcard.length - 1 !== saludcardid) doc.addPage();
});

doc.end();
function cmToPt(cm) {
    return cm * 28.3465;
}
