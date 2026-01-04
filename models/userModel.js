import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // <--- 1. Garanta que isso está importado!

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // Avatar padrão cinza
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true
});


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;