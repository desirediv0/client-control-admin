"use client";

import { CREATE_CHILD } from "@/app/GraphQL/Queries";
import { CustomSession } from "@/types/type";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

const Fake = () => {
  const { data: session } = useSession();
  const sessionData = session as CustomSession;
  const [createChild] = useMutation(CREATE_CHILD);
  const [count, setCount] = useState(0);

  const createFakeChildren = async () => {
    const parentId = sessionData?.user?.id;

    if (!parentId) {
      toast.error("User session not available. Please login again.");
      return;
    }

    const mongoDbUrl =
      "mongodb+srv://codeshorts007:csBofXrQ00KpO1yW@cluster0.9qetmcv.mongodb.net/Users";
    const postgresUrl =
      "postgresql://postgres:Ritesh123@localhost:5432/test?schema=public";

    for (let i = 0; i < 50; i++) {
      try {
        const isMongoDb = i % 2 === 0;
        const fakeData = {
          name: `Fake Child ${i + 1}`,
          email: `fakechild${i + 1}@example.com`,
          phone: `123456789${i}`,
          domain: `https://fakechild${i + 1}.com`,
          joinDate: new Date().toISOString(),
          parentId: parentId,
          totalAmt: 10000 + i * 100,
          databaseType: isMongoDb ? "MongoDB" : "PostgreSQL",
          databaseUrl: isMongoDb ? mongoDbUrl : postgresUrl,
        };

        await createChild({ variables: fakeData });
        setCount(i + 1);
      } catch (error) {
        console.error(error);
        toast.error(`Failed to create fake child ${i + 1}. Stopping.`);
        break;
      }
    }
    toast.success(`Created ${count} fake children.`);
  };

  return (
    <div>
      <button onClick={createFakeChildren} disabled={count === 50}>
        Create 50 Fake Children
      </button>
      <p>Created: {count} / 50</p>
    </div>
  );
};

export default Fake;
