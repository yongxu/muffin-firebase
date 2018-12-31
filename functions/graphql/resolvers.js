const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
const monkeysRef = admin.database().ref('monkeys');
module.exports = {
  Query: {
    monkeys() {
      return monkeysRef.once('value')
        .then(snapshot => {
          const monkeys = snapshot.val();
          if (monkeys === null) return [];
          return Object.keys(monkeys).map(o => Object.assign({ id: o }, monkeys[o]));
        });
    },
  },
  Mutation: {
    createMonkey(_, { input }) {
      return (
        new Promise((resolve) => {
          const monkey = monkeysRef.push(input, () => {
            resolve(Object.assign({ id: monkey.key }, input)
            );
          });
        })
      );
    },
    updateMonkey(_, { input }) {
      const monkeyRef = monkeysRef.child(input.id);
      return monkeyRef.once('value')
        .then(snapshot => {
          const monkey = snapshot.val();
          if (monkey === null) throw new Error('404');
          return monkey;
        })
        .then((monkey) => {
          const update = Object.assign(monkey, input);
          delete update.id;
          return monkeyRef.set(update).then(() => (Object.assign({ id: input.id }, update)));
        });
    },
    deleteMonkey(_, { input }) {
      const monkeyRef = monkeysRef.child(input.id);
      return monkeyRef.once('value')
        .then((snapshot) => {
          const monkey = snapshot.val();
          if (monkey === null) throw new Error('404');
          return Object.assign({ id: input.id }, monkey);
        })
        .then(monkey => monkeyRef.remove().then(() => (monkey)));
    }
  }
};
