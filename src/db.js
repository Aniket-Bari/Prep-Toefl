import Dexie from 'dexie';

const advancedTOEFLDatabase = new Dexie("PREP-TOEFL-27");

advancedTOEFLDatabase.version(1).stores({
  ReadingTestQuestion: '++id, paragraph, questions',
  ReadingTestAnswer: '++id, testId, questionIndex, answer',
  ReadingTestCorrectAnswer: '++id, testId, questionIndex, correctAnswer',
});

export default advancedTOEFLDatabase;
