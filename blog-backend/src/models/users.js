import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;


const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
}

UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; //true or false
}

//왜 statics인가????
// 메소드는 객체의 인스턴스를 만들어야만 사용이 가능
// 스태틱은 객체의 인스턴스를 만들지 않아도 사용이 가능
UserSchema.statics.findByUsername = async function(username) {
    return this.findOne({ username });
}

//hashedPassword를 왜 지워주는지 아직은 잘 모르겠음 보안상인가?
UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken = function(){
    const token = jwt.sign(
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣습니다
        {
            expiresIn: '7d' //7일동안 유효
        },
    );
    return token;
};

/* (err, token) => {
    if(err) {
        console.log("error="+err);
        return;
    }
    console.log("token="+token);
}, */

const User = mongoose.model('User', UserSchema);
export default User;