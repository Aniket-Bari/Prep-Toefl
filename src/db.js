import Dexie from 'dexie';

const advancedTOEFLDatabase = new Dexie("PREP-TOEFL-27");

advancedTOEFLDatabase.version(1).stores({
  readingTestQuestion: '++id',
});
// advancedTOEFLDatabase.version(1).stores({
//   readingTestQ: '++id'
// });
advancedTOEFLDatabase.version(1).stores({
  readingTestAnswer: '++id',
});

export default advancedTOEFLDatabase;
