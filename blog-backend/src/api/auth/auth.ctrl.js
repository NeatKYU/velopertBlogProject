import Joi from 'joi';
import User from '../../models/users.js';

export const register = async ctx => {
    // 회원가입
    // Request Body 검증하기
    const schema = Joi.object({
        username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(20)
                    .required(),
        password: Joi.string().required(),
    });

    //error확인
    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try{
        //username이 이미 존재하는지 확인
        const exists = await User.findByUsername(username);
        if(exists){ //똑같은 이름의 유저가 있으면 에러
            ctx.status = 409;
            return;
        }

        const user = new User({
            username,
        });
        await user.setPassword(password); //패스워드 설정
        await user.save(); //DB에 저장
        
        /* 
        const data = user.toJSON();
        delete data.hashedPassword;
        ctx.body = data;  ==> model/users.js에 정의
        */
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set( 'access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });

    } catch(e){
        ctx.throw(500, e);
    }
};

export const login = async ctx => {
    // 로그인
    const { username, password } = ctx.request.body;

    //username, password가 없으면 에러 처리
    if(!username || !password){
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUsername(username);

        if(!user){
            ctx.status = 401;
            return;
        }
        
        const valid = await user.checkPassword(password);
        //잘못된 비밀번호
        if(!valid){
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        
        const token = user.generateToken();

        ctx.cookies.set( 'access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });

    } catch (e){
        ctx.throw(500, e);
    }
};
export const check = async ctx => {
    // 로그인 상태 확인
    const {user} = ctx.state;
    if(!user) {
        //로그인중 아님
        ctx.status = 401;
        return;
    }
    ctx.body = user;
};
export const logout = async ctx => {
    // 로그아웃
    ctx.cookies.set('access_token');
    ctx.status = 204;
};