"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const check = require('validator').check;
var FieldValue = admin.firestore.FieldValue;
admin.initializeApp(functions.config().firebase);
exports.createNewFood = functions.https.onRequest((rq, rs) => {
    const nameUA = rq.body.nameUA;
    const nameEN = rq.body.nameEN;
    const kkal = rq.body.caloricity;
    const protein = rq.body.protein;
    const fat = rq.body.fat;
    const carbohydrates = rq.body.carbohydrates;
    const gi = rq.body.gi;
    const fbID = nameEN.toLowerCase();
    const object = {
        fbID: fbID,
        caloricity: +kkal,
        carbohydrates: +carbohydrates,
        fat: +fat,
        gi: gi,
        name: {
            en: nameEN,
            ua: nameUA
        },
        protein: +protein
    };
    admin.firestore().collection('/foods').doc(fbID)
        .set(object)
        .then(value => {
        rs.json({
            msg: 'Successfully Saved Food Model',
            model: object
        });
    })
        .catch(e => {
        rs.json({
            error: {
                type: 'FirebaseModelSaveError',
                details: e
            }
        });
    });
});
exports.populateDocumentId = functions
    .firestore
    .document('/{collection}/{documentId}')
    .onCreate((doc, context) => {
    console.log(doc);
    console.log(context);
    const collection = context.params.collection;
    const documentId = context.params.documentId;
    admin.firestore().collection(collection).doc(documentId)
        .update({ id: documentId })
        .then((d) => {
        console.log(`Document Id successfully populated for [/${collection}/${documentId}] `);
        console.log(d);
    })
        .catch(e => {
        console.log(e);
    });
});
exports.populateNewAuthenticatedUser = functions.auth.user().onCreate((user) => {
    admin.firestore().collection('users').doc(user.email).set({
        email: user.email,
        uuid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        role: 'USER',
        status: 'ACTIVE',
        meta: {
            created: FieldValue.serverTimestamp()
        }
    }).then(savedUser => {
        console.log(savedUser);
    }).catch(e => {
        console.log(e);
    });
});
//# sourceMappingURL=index.js.map