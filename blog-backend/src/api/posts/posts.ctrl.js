import Post from '../../models/post.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if(!ObjectId.isValid(id)){
    ctx.status = 400;
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
}

export const write = async ctx => {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array()
    .items(Joi.string())
    .required(),
  });

  const result = schema.validate(ctx.request.body);
  //const result = Joi.validate(ctx.request.body, schema);
  if(result.error){
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body: sanitizeHtml(body, sanitizeOption),
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
// html태그 지워주는 역할
const removeHtmlAndShorten = body => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

//GET /api/posts
export const list = async ctx => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 합니다.
  // 값이 주어지지 않았다면 1을 기본으로 사용합니다.
  const page = parseInt(ctx.query.page || '1', 10);

  if( page < 1 ){
    ctx.status = 400;
    return;
  }

  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  }

  try {
    const posts = await Post.find(query)
                        .sort({ _id: -1 })
                        .limit(10)
                        .skip((page - 1) * 10)
                        .lean()
                        .exec();
    //list의 총 개수를 세는건가?
    const postCount = await Post.countDocuments(query).exec();
    ctx.set( 'Last-Page', Math.ceil(postCount / 10) );

    ctx.body = posts
                //.map(post => post.toJSON())
                .map(post => ({
                  ...post,
                  body: removeHtmlAndShorten(post.body),
                }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

//GET /api/posts/:id
export const read = async ctx => {
  ctx.body = ctx.state.post;
};

//DELETE /api/posts/:id
export const remove = async ctx => {
    const { id } = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // NO Content (성공하기는 했지만 응답할 데이터는 없음)
    } catch(e){
        ctx.throw(500, e);
    }
};


export const update = async ctx => {
    const { id } = ctx.params;
    const schema = Joi.object({
      title: Joi.string(),
      body: Joi.string(),
      tags: Joi.array().items(Joi.string()),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
      ctx.status = 400;
      ctx.body = result.error;
      return;
    }

    const nextData = { ...ctx.request.body };
    // 글이 있으면 태그찍히는걸 지워주는 그런거?
    if(nextData.body) {
      nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }

    try{
        const post = await Post.findByIdAndUpdate(id, nextData, {
            new: true,
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e){
        ctx.throw(500, e);
    }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};