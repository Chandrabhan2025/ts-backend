import { ApolloServer, gql } from "apollo-server-express";
import { Post } from "./models/Post_model";
import { User } from "./models/User";
import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const typeDefs = gql`
  type Post {
    id: ID
    questionText: String
    moduleName: String
    options: [Option]
    correctOptionId: Int
    updatedBy: String
    createdDate: String
    createdBy: String
  }

  type Option {
    optionId: String
    optionText: String
  }

  type Query {
    getAllPosts: [Post]
    getPost(id: ID): Post
  }

  input PostOption {
    optionId: String
    optionText: String
  }

  input PostInput {
    questionText: String
    moduleName: String
    options: [PostOption]
    correctOptionId: Int
    updatedBy: String
    createdBy: String
  }

  type User {
    username: String
    email: String
    password: String!
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String!
  }

  input LoginInput {
    email: String
    password: String!
  }

  type Mutation {
    createPost(post: PostInput): Post
    deletePost(id: ID): String
    updatePost(id: ID, post: PostInput): Post
    registerUser(registerInput: RegisterInput): User
    loginUser(loginInput: LoginInput): User
  }
`;

const resolvers = {
  Query: {
    getAllPosts: async () => {
      return await Post.find();
    },
    getPost: async (
      _parent: any,
      { id, optionId }: any,
      _context: any,
      _info: any
    ) => {
      return await Post.findById(id);
    },
  },

  Mutation: {
    createPost: async (
      parent: any,
      args: {
        post: any;
        questionText: any;
        moduleName: any;
        options: any;
        correctOptionId: any;
        updatedBy: any;
        createdBy: any;
      }
    ) => {
      const {
        questionText,
        moduleName,
        options,
        correctOptionId,
        createdBy,
        updatedBy,
      } = args.post;
      const post = new Post({
        questionText,
        moduleName,
        options,
        correctOptionId,
        updatedBy,
        createdBy,
      });
      await post.save();
      return post;
    },
    deletePost: async (parent: any, args: any) => {
      const { id } = args;
      await Post.findByIdAndDelete(id);
      return "Ok, Post deleted";
    },
    updatePost: async (parent: any, args: any) => {
      const { id } = args;
      const {
        questionText,
        moduleName,
        options,
        correctOptionId,
        createdBy,
        updatedBy,
      } = args.post;
      const post = await Post.findByIdAndUpdate(
        id,
        {
          questionText,
          moduleName,
          options,
          correctOptionId,
          createdBy,
          updatedBy,
        },
        { new: true }
      );
      return post;
    },
    registerUser: async (
      _: any,
      { registerInput: { username, email, password } }: any
    ) => {
      //see if an old user exis with email
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        throw new ApolloError("user is already registered");
      }

      //encrypt password
      var encryptedPassword = await bcrypt.hash(password, 10);

      // build out mongoose model
      const newUser = new User({
        username: username,
        email: email.toLowerCase(),
        password: encryptedPassword,
      });

      //creat an jwt token
      const token = jwt.sign({ user_id: newUser._id, email }, "UNSAFE_STRING", {
        expiresIn: "2h",
      });
      newUser.token = token;
      newUser.save();
      return newUser;
    },
    loginUser: async (_: any, { loginInput: { email, password } }: any) => {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, email }, "UNSAFE_STRING", {
          expiresIn: "2h",
        });
        user.token = token;
        return user;
      } else {
        throw new ApolloError("incorrect password");
      }
    },
  },
};

export { typeDefs, resolvers };
