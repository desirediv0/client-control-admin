import prisma from "@/db/db.config";
import { UserInputError } from "apollo-server-micro";
import bcrypt from "bcrypt";

const userResolver = {
  Query: {
    getUser: async (_: any, args: { id: string }) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        if (!user) {
          throw new UserInputError("User not found", {
            invalidArgs: ["id"],
          });
        }
        return user;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to get user");
      }
    },
    getUsers: async () => {
      try {
        const users = await prisma.user.findMany();
        return users;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to get users");
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      args: { name?: string; email: string; password: string }
    ) => {
      try {
        if (!args.email || !args.password) {
          throw new UserInputError("Email and password are required", {
            invalidArgs: ["email", "password"],
          });
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            email: args.email,
          },
        });

        if (existingUser) {
          throw new UserInputError("User already exists", {
            invalidArgs: ["email"],
          });
        } else {
          const name = args.name || args.email.split("@")[0];
          const hashedPassword = await bcrypt.hash(args.password, 10);

          const savedUser = await prisma.user.create({
            data: {
              name,
              email: args.email,
              password: hashedPassword,
            },
          });

          return savedUser;
        }
      } catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to create user");
      }
    },
    updateUser: async (
      _: any,
      args: { id: string; name?: string; email?: string }
    ) => {
      try {
        if (!args.id) {
          throw new UserInputError("User id is required", {
            invalidArgs: ["id"],
          });
        }
        const updateData: { [key: string]: any } = {};
        if (args.name !== undefined) updateData.name = args.name;
        if (args.email !== undefined) updateData.email = args.email;

        if (Object.keys(updateData).length === 0) {
          throw new UserInputError(
            "At least one field (name, email, or password) is required for update",
            {
              invalidArgs: ["name", "email", "password"],
            }
          );
        }

        if (args.email !== undefined) {
          const existingUser = await prisma.user.findFirst({
            where: {
              email: args.email,
              id: { not: args.id },
            },
          });
          if (existingUser) {
            throw new UserInputError("Email already exists", {
              invalidArgs: ["email"],
            });
          }
        }

        const updatedUser = await prisma.user.update({
          where: { id: args.id },
          data: updateData,
        });

        if (!updatedUser) {
          throw new UserInputError("User not found", {
            invalidArgs: ["id"],
          });
        }

        return updatedUser;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
    deleteUser: async (_: any, args: { id: string }) => {
      try {
        if (!args.id) {
          throw new UserInputError("User id is required", {
            invalidArgs: ["id"],
          });
        }

        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });
        if (!user) {
          throw new UserInputError("User not found", {
            invalidArgs: ["id"],
          });
        }

        await prisma.child.deleteMany({
          where: { parentId: args.id },
        });

        const deletedUser = await prisma.user.delete({
          where: { id: args.id },
        });
        if (!deletedUser) {
          throw new UserInputError("User not found", {
            invalidArgs: ["id"],
          });
        }
        return deletedUser;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to delete user");
      }
    },
  },
};

export default userResolver;
