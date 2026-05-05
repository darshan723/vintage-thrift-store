import mongoose from 'mongoose';

const uri = "mongodb+srv://darshanx8_db_user:vintage123@cluster0.ksvfhsv.mongodb.net/test?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema, 'users');

async function makeAdmin() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Atlas.");
    
    const users = await User.find({});
    if (users.length === 0) {
      console.log("No users found in the database. Please make sure you signed up on the live website.");
    } else {
      const user = users[0];
      await User.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
      console.log(`Successfully made user ${user.email || user._id} an admin!`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.disconnect();
  }
}

makeAdmin();
