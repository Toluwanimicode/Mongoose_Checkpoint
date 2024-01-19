// index.js
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Import the Person model
const Person = require('./models/person');

async function main() {
  try {
    // Example: Create and save a record
    const person = new Person({ name: 'John', age: 25, favoriteFoods: ['Pizza', 'Burger'] });
    const savedPerson = await person.save();
    console.log('Record saved:', savedPerson);

    // Create Many Records with model.create()
    const arrayOfPeople = [
      { name: 'Alice', age: 30, favoriteFoods: ['Sushi', 'Pasta'] },
      { name: 'Bob', age: 22, favoriteFoods: ['Steak', 'Salad'] },
    ];
    const createdPeople = await Person.create(arrayOfPeople);
    console.log('Records created:', createdPeople);

    // Use model.find() to Search Your Database
    const foundPeople = await Person.find({ name: 'John' });
    console.log('People with name John:', foundPeople);

    // Use model.findOne() to Return a Single Matching Document
    const foundPerson = await Person.findOne({ favoriteFoods: 'Pizza' });
    console.log('Person with Pizza in favoriteFoods:', foundPerson);

    // Use model.findById() to Search Your Database By _id
    const personId = 'your_person_id_here';
    const foundPersonById = await Person.findById(personId);
    if (foundPersonById) {
      console.log('Person with ID:', foundPersonById);
    } else {
      console.log('Person not found.');
    }

    // Perform New Updates on a Document Using model.findOneAndUpdate()
    const personNameToUpdate = 'John';
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personNameToUpdate },
      { $set: { age: 20 } },
      { new: true }
    );
    console.log('Updated Person:', updatedPerson);

    // Delete One Document Using model.findByIdAndRemove
    const personIdToDelete = 'your_person_id_here';
    const removedPerson = await Person.findByIdAndRemove(personIdToDelete);
    console.log('Removed Person:', removedPerson);

    // MongoDB and Mongoose - Delete Many Documents with model.remove()
    const personNameToDelete = 'Mary';
    const deletionResult = await Person.remove({ name: personNameToDelete });
    console.log('Number of people deleted:', deletionResult.deletedCount);

    // Chain Search Query Helpers to Narrow Search Results
    const burritoLovers = await Person.find({ favoriteFoods: 'Burritos' })
      .sort('name')
      .limit(2)
      .select('-age')
      .exec();
    console.log('Search results:', burritoLovers);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection after all operations are completed
    mongoose.connection.close();
  }
}

// Call the main function
main();