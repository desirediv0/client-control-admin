import prisma from "@/db/db.config";
import { UserInputError } from "apollo-server-micro";

const childResolver = {
  Query: {
    getChild: async (_: any, args: { id: string; parentId: string }) => {
      try {
        const { id, parentId } = args;
        const child = await prisma.child.findFirst({
          where: {
            id,
            parentId,
          },
        });

        if (!child) {
          throw new UserInputError("Child not found");
        }

        return child;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to get child");
      }
    },
    getChildrenByParentId: async (
      _: any,
      args: { parentId: string; page?: number; pageSize?: number }
    ) => {
      try {
        const { parentId, page = 1, pageSize = 10 } = args;
        const skip = (page - 1) * pageSize;

        const [children, totalCount] = await Promise.all([
          prisma.child.findMany({
            where: { parentId },
            take: pageSize,
            skip: skip,
            orderBy: { createdAt: "desc" },
          }),
          prisma.child.count({ where: { parentId } }),
        ]);

        return {
          children,
          pageInfo: {
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
          },
          totalChildren: totalCount,
        };
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to get children");
      }
    },
    childSearch: async (_: any, args: { search: string; parentId: string }) => {
      try {
        const { search, parentId } = args;
        const children = await prisma.child.findMany({
          where: {
            parentId,
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
              { domain: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        });
        return children;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error("Failed to search for children");
      }
    },
    getDashboardData: async (_: any, args: { parentId: string }) => {
      try {
        const { parentId } = args;
        const children = await prisma.child.findMany({
          where: { parentId },
        });

        const totalChildren = children.length;
        const activeChildren = totalChildren; // Assuming all children are active for now
        const inactiveChildren = 0; // Can be calculated if status field exists

        const totalAmount = children.reduce(
          (sum, child) => sum + (child.totalAmt || 0),
          0
        );

        // Calculate user status data
        const userStatusData = [
          { name: "Active", value: activeChildren },
          { name: "Inactive", value: inactiveChildren },
        ];

        // If no children, provide default data
        if (totalChildren === 0) {
          return {
            userStatusData: [
              { name: "Active", value: 0 },
              { name: "Inactive", value: 0 },
            ],
            usersByParentData: [],
            totalChildren: 0,
            activeChildren: 0,
            totalAmount: 0,
          };
        }

        const usersByParentData = await prisma.user.findMany({
          where: { parentId },
          select: {
            name: true,
            _count: {
              select: { children: true },
            },
          },
        });

        // Format users by parent data
        const formattedUsersByParentData =
          usersByParentData.length > 0
            ? usersByParentData.map((parent) => ({
                name: parent.name,
                users: parent._count.children,
              }))
            : [];

        return {
          userStatusData,
          usersByParentData: formattedUsersByParentData,
          totalChildren,
          activeChildren,
          totalAmount,
        };
      } catch (error) {
        console.error("Error in getDashboardData:", error);

        return {
          userStatusData: [
            { name: "Active", value: 0 },
            { name: "Inactive", value: 0 },
          ],
          usersByParentData: [],
          totalChildren: 0,
          activeChildren: 0,
          totalAmount: 0,
        };
      }
    },
  },
  Mutation: {
    createChild: async (
      _: any,
      args: {
        name: string;
        email: string;
        phone: string;
        password: string;
        databaseUrl: string;
        domain: string;
        joinDate: string;
        totalAmt: number;
        parentId: string;
      }
    ) => {
      try {
        const {
          name,
          email,
          phone,
          domain,
          password,
          databaseUrl,
          joinDate,
          totalAmt,
          parentId,
        } = args;
        if (
          !name ||
          !email ||
          !phone ||
          !totalAmt ||
          !parentId ||
          !databaseUrl ||
          !password
        ) {
          return new UserInputError("All fields are required");
        }

        if (!email.includes("@")) {
          return new UserInputError("Invalid email");
        }

        if (phone.length < 10) {
          return new UserInputError("Invalid phone number");
        }

        if (totalAmt < 0) {
          return new UserInputError("Invalid total amount");
        }

        if (!parentId) {
          return new UserInputError("Parent id is required");
        }

        if (!joinDate) {
          return new UserInputError("Join date is required");
        }

        if (!databaseUrl) {
          return new UserInputError("Database url is required");
        }

        if (password.length < 8) {
          return new UserInputError(
            "Password must be at least 8 characters long"
          );
        }

        const child = await prisma.child.create({
          data: {
            name: name.toLowerCase(),
            email: email.toLowerCase(),
            phone,
            domain: domain.toLowerCase(),
            joinDate: new Date(joinDate).toISOString(),
            databaseUrl,
            password,
            totalAmt: totalAmt || 0,
            parentId,
          },
        });

        return child;
      } catch (error) {
        if (error instanceof UserInputError) {
          return error;
        }
        return new Error(`Failed to create child: ${error}`);
      }
    },
    deleteChild: async (_: any, args: { id: string }) => {
      try {
        const { id } = args;
        if (!id) {
          return new UserInputError("Child id is required");
        }

        const child = await prisma.child.findUnique({
          where: { id },
        });
        if (!child) {
          return new UserInputError("Child not found with the given id");
        }

        const deletedChild = await prisma.child.delete({
          where: { id },
        });

        if (!deletedChild) {
          return new UserInputError("Failed to delete child");
        }

        return deletedChild;
      } catch (error) {
        if (error instanceof UserInputError) {
          return error;
        }
        return new Error("failed to delete child");
      }
    },

    updateChildField: async (
      _: any,
      args: {
        childId: string;
        field: string;
        value: string | number | boolean;
      }
    ) => {
      try {
        const { childId, field, value } = args;

        if (!childId || !field || value === undefined) {
          return new UserInputError("All fields are required");
        }

        const child = await prisma.child.findFirst({
          where: { id: childId },
        });

        if (!child) {
          return new UserInputError("Child not found with the given id");
        }

        // Dynamically create the update object
        const updateData = { [field]: value };

        // Update the parsing logic
        if (field === "totalAmt") {
          updateData[field] =
            typeof value === "string" ? parseFloat(value) : value;
        } else if (field === "status") {
          updateData[field] =
            typeof value === "string" ? value.toLowerCase() === "true" : value;
        } else {
          updateData[field] = value;
        }

        const updatedChild = await prisma.child.update({
          where: { id: childId },
          data: updateData,
        });

        return updatedChild;
      } catch (error) {
        console.error("Error updating child field:", error);
        if (error instanceof UserInputError) {
          return error;
        }
        return new Error("Failed to update child field");
      }
    },
  },
};

export default childResolver;
